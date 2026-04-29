import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View, StyleSheet, PanResponder, TouchableOpacity, Text,
  Modal, StatusBar, Dimensions, Alert,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { useGame } from '../shared/GameContext';
import { LEVELS, ENEMIES, HINTS, POWER_UPS } from '../shared/gameData';
import { applyPhysics, moveEnemies, moveProjectiles, GROUND_Y, SCREEN_W, SCREEN_H, JUMP_FORCE, PLAYER_SPEED } from '../shared/systems/physics';
import { checkCollisions } from '../shared/systems/collision';
import { RENDERERS } from '../shared/components/renderers';
import GameHUD from '../shared/components/GameHUD';
import { LEVEL_EXTRA_SYSTEMS } from '../shared/systems/levelSystems';

const INVINCIBILITY_MS = 1200;
const SHOOT_COOLDOWN = 400;

function buildLevel(levelId, wbcMax) {
  const lvl = LEVELS.find(l => l.id === levelId);
  const bossData = ENEMIES[lvl.boss];
  const henchmanData = ENEMIES[lvl.henchmen[0]];

  const entities = {
    player: {
      type: 'player',
      pos: { x: 80, y: GROUND_Y - 32 },
      velocity: { x: 0, y: 0 },
      size: 32,
      scale: 1,
      health: wbcMax,
      maxHealth: wbcMax,
      alive: true,
      grounded: true,
      invincible: false,
      facing: 1, // 1 = right, -1 = left
      renderer: RENDERERS.player,
    },
    ground: {
      type: 'ground',
      pos: { x: 0, y: GROUND_Y },
      width: SCREEN_W,
      renderer: RENDERERS.ground,
    },
  };

  // Platforms
  const platDefs = [
    { x: 160, y: GROUND_Y - 100, w: 120 },
    { x: 340, y: GROUND_Y - 160, w: 100 },
    { x: 520, y: GROUND_Y - 120, w: 140 },
    { x: 680, y: GROUND_Y - 200, w: 100 },
  ];
  platDefs.forEach((p, i) => {
    entities[`plat_${i}`] = {
      type: 'platform',
      pos: { x: p.x, y: p.y },
      width: p.w,
      height: 14,
      renderer: RENDERERS.platform,
    };
  });

  // Henchmen enemies
  const hSpacing = (SCREEN_W - 200) / 3;
  [0, 1, 2].forEach(i => {
    entities[`enemy_h_${i}`] = {
      type: 'enemy',
      ...henchmanData,
      pos: { x: 200 + i * hSpacing, y: GROUND_Y - henchmanData.size },
      velocity: { x: (i % 2 === 0 ? 1 : -1) * henchmanData.speed, y: 0 },
      health: henchmanData.health,
      maxHealth: henchmanData.health,
      alive: true,
      renderer: RENDERERS.enemy,
      spawnedBy: 'henchman',
    };
  });

  // Boss (spawns later, starts off-screen to the right)
  entities.boss = {
    type: 'enemy',
    ...bossData,
    pos: { x: SCREEN_W + 100, y: GROUND_Y - bossData.size },
    velocity: { x: -bossData.speed * 0.7, y: 0 },
    health: bossData.health * 2,
    maxHealth: bossData.health * 2,
    alive: false, // spawns when henchmen cleared
    renderer: RENDERERS.enemy,
    isBoss: true,
  };

  // Collectibles — antibodies scattered
  [0, 1, 2, 3].forEach(i => {
    entities[`antibody_${i}`] = {
      type: 'collectible',
      kind: 'antibody',
      pos: { x: 150 + i * 160, y: GROUND_Y - 50 - (i % 2) * 80 },
      size: 20,
      collected: false,
      renderer: RENDERERS.collectible,
      value: 10,
    };
  });

  // Hint collectible
  entities.hint_0 = {
    type: 'collectible',
    kind: 'hint',
    pos: { x: SCREEN_W * 0.5, y: GROUND_Y - 120 },
    size: 22,
    collected: false,
    renderer: RENDERERS.collectible,
    hintId: `h${levelId}`,
  };

  // Power-up collectible
  entities.powerup_0 = {
    type: 'collectible',
    kind: 'powerup_macrophage',
    pos: { x: SCREEN_W * 0.35, y: GROUND_Y - 180 },
    size: 24,
    collected: false,
    renderer: RENDERERS.collectible,
  };

  return entities;
}

export default function GameScreen({ navigation, route }) {
  const { levelId } = route.params;
  const { state, dispatch } = useGame();
  const levelData = LEVELS.find(l => l.id === levelId);

  const wbcMax = state.immunodeficiencyMode ? 1 : state.wbcMax;
  const [health, setHealth] = useState(wbcMax);
  const [antibodies, setAntibodies] = useState(0);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [bossSpawned, setBossSpawned] = useState(false);
  const [enemiesKilled, setEnemiesKilled] = useState(0);
  const [showHint, setShowHint] = useState(null);
  const [visibility, setVisibility] = useState(1); // Level 4 mechanic

  const engineRef = useRef(null);
  const entitiesRef = useRef(buildLevel(levelId, wbcMax));
  const inputRef = useRef({ left: false, right: false, shoot: false, shootDir: 1 });
  const lastShotRef = useRef(0);
  const projCountRef = useRef(0);
  const invincibleUntilRef = useRef(0);
  const powerUpTimerRef = useRef(null);
  const healthRef = useRef(wbcMax);
  const antibodiesRef = useRef(0);
  const scoreRef = useRef(0);
  const gameActiveRef = useRef(true);

  // Input: left / right arrows + jump + shoot
  const handleLeft = () => { inputRef.current.left = true; inputRef.current.right = false; };
  const handleRight = () => { inputRef.current.right = true; inputRef.current.left = false; };
  const handleStopH = () => { inputRef.current.left = false; inputRef.current.right = false; };
  const handleJump = () => {
    const p = entitiesRef.current?.player;
    if (p && p.grounded) { p.velocity.y = JUMP_FORCE; p.grounded = false; }
  };
  const handleShoot = () => { inputRef.current.shoot = true; };

  function onEnemyHit(enemy) {
    if (!gameActiveRef.current) return;
    const reward = enemy.antibodyReward || 8;
    antibodiesRef.current += reward;
    scoreRef.current += reward * 10;
    setAntibodies(a => a + reward);
    setScore(s => s + reward * 10);

    const newKilled = enemiesKilled + 1;
    setEnemiesKilled(newKilled);

    // Boss spawn after henchmen cleared
    if (!bossSpawned && newKilled >= 3) {
      const boss = entitiesRef.current?.boss;
      if (boss) {
        boss.alive = true;
        boss.pos.x = SCREEN_W - 60;
        setBossSpawned(true);
      }
    }

    // Win when boss dies
    if (enemy.isBoss) handleWin();

    // Unlock enemy card
    dispatch({ type: 'UNLOCK_ENEMY_CARD', id: enemy.id });
  }

  function onPlayerHit() {
    if (!gameActiveRef.current) return;
    const now = Date.now();
    if (now < invincibleUntilRef.current) return;
    invincibleUntilRef.current = now + INVINCIBILITY_MS;

    const p = entitiesRef.current?.player;
    if (p) p.invincible = true;
    setTimeout(() => { if (p) p.invincible = false; }, INVINCIBILITY_MS);

    const newHealth = Math.max(0, healthRef.current - 1);
    healthRef.current = newHealth;
    setHealth(newHealth);

    if (newHealth <= 0) handleGameOver();
  }

  function handleGameOver() {
    if (!gameActiveRef.current) return;
    gameActiveRef.current = false;
    setGameOver(true);
  }

  function handleWin() {
    if (!gameActiveRef.current) return;
    gameActiveRef.current = false;
    setWon(true);

    // Persist to global state
    dispatch({ type: 'EARN_ANTIBODIES', amount: antibodiesRef.current });
    dispatch({ type: 'SET_HIGH_SCORE', levelId, score: scoreRef.current });
    dispatch({ type: 'UNLOCK_LEVEL', level: levelId + 1 });

    // Unlock level rewards
    const lvl = LEVELS.find(l => l.id === levelId);
    lvl.antibioticRewards?.forEach(id => dispatch({ type: 'UNLOCK_ANTIBIOTIC', id }));

    // Unlock hints
    HINTS.filter(h => h.level === levelId).forEach(h => dispatch({ type: 'UNLOCK_HINT', id: h.id }));
    dispatch({ type: 'UNLOCK_MCS_REPORT', id: `mcs${levelId}` });
  }

  function activatePowerUp(kind) {
    const key = kind.replace('powerup_', '');
    const pu = POWER_UPS[key];
    if (!pu) return;
    setActivePowerUp(pu);
    const p = entitiesRef.current?.player;
    if (p && key === 'macrophage') p.scale = 1.8;
    clearTimeout(powerUpTimerRef.current);
    powerUpTimerRef.current = setTimeout(() => {
      setActivePowerUp(null);
      if (p) p.scale = 1;
    }, pu.duration);
  }

  // Game systems pipeline
  const systems = useCallback([
    // Input
    (entities) => {
      const p = entities.player;
      if (!p || !p.alive || !gameActiveRef.current) return entities;
      const input = inputRef.current;
      p.velocity.x = input.left ? -PLAYER_SPEED : input.right ? PLAYER_SPEED : 0;
      if (input.left) p.facing = -1;
      if (input.right) p.facing = 1;

      // Shooting
      if (input.shoot) {
        const now = Date.now();
        if (now - lastShotRef.current > SHOOT_COOLDOWN) {
          lastShotRef.current = now;
          const id = `proj_${projCountRef.current++}`;
          entities[id] = {
            type: 'projectile',
            pos: { x: p.pos.x + p.size / 2 - 5, y: p.pos.y + p.size / 2 - 5 },
            velocity: { x: p.facing * 10, y: 0 },
            size: 10,
            fromPlayer: true,
            renderer: RENDERERS.projectile,
          };
        }
        input.shoot = false;
      }
      return entities;
    },
    applyPhysics,
    moveEnemies,
    moveProjectiles,
    // Collectible collection
    (entities) => {
      const p = entities.player;
      if (!p || !p.alive) return entities;
      const pr = p.size / 2;
      const px = p.pos.x + pr;
      const py = p.pos.y + pr;

      for (const [key, e] of Object.entries(entities)) {
        if (e.type !== 'collectible' || e.collected) continue;
        const cr = e.size / 2;
        const dx = px - (e.pos.x + cr);
        const dy = py - (e.pos.y + cr);
        if (Math.sqrt(dx * dx + dy * dy) < pr + cr) {
          e.collected = true;
          if (e.kind === 'antibody') {
            antibodiesRef.current += e.value;
            scoreRef.current += e.value * 5;
            setAntibodies(a => a + e.value);
            setScore(s => s + e.value * 5);
          } else if (e.kind === 'hint') {
            const hint = HINTS.find(h => h.id === e.hintId);
            if (hint) setShowHint(hint);
            dispatch({ type: 'UNLOCK_HINT', id: e.hintId });
          } else if (e.kind.startsWith('powerup_')) {
            activatePowerUp(e.kind);
          }
        }
      }
      return entities;
    },
    // Level-specific systems
    ...(LEVEL_EXTRA_SYSTEMS[levelId] || []),
    // Collision
    (entities) => checkCollisions(entities, onEnemyHit, onPlayerHit),
  ], [levelId, bossSpawned, enemiesKilled]);

  function restart() {
    entitiesRef.current = buildLevel(levelId, wbcMax);
    healthRef.current = wbcMax;
    antibodiesRef.current = 0;
    scoreRef.current = 0;
    gameActiveRef.current = true;
    projCountRef.current = 0;
    setBossSpawned(false);
    setEnemiesKilled(0);
    setHealth(wbcMax);
    setAntibodies(0);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setActivePowerUp(null);
    engineRef.current?.swap(buildLevel(levelId, wbcMax));
  }

  return (
    <View style={[styles.container, { backgroundColor: levelData.bgColor }]}>
      <StatusBar hidden />

      <GameEngine
        ref={engineRef}
        style={StyleSheet.absoluteFill}
        systems={systems}
        entities={entitiesRef.current}
        running={!paused && !gameOver && !won}
      />

      {/* Level 4: visibility degradation overlay */}
      {levelId === 4 && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000a1a', opacity: 1 - visibility }]} pointerEvents="none" />
      )}

      <GameHUD
        health={health}
        maxHealth={wbcMax}
        antibodies={antibodies}
        score={score}
        levelName={`${levelData.id}. ${levelData.name}`}
        activePowerUp={activePowerUp}
        immunoMode={state.immunodeficiencyMode}
        onPause={() => setPaused(p => !p)}
      />

      {/* Controls */}
      <View style={styles.controls} pointerEvents="box-none">
        <View style={styles.dpad}>
          <TouchableOpacity
            style={styles.dpadBtn}
            onPressIn={handleLeft}
            onPressOut={handleStopH}
          >
            <Text style={styles.dpadText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jumpBtn} onPress={handleJump}>
            <Text style={styles.jumpText}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dpadBtn}
            onPressIn={handleRight}
            onPressOut={handleStopH}
          >
            <Text style={styles.dpadText}>▶</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.shootBtn} onPressIn={handleShoot}>
          <Text style={styles.shootText}>⬡ FIRE</Text>
        </TouchableOpacity>
      </View>

      {/* Pause overlay */}
      {paused && !gameOver && !won && (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>PAUSED</Text>
          <TouchableOpacity style={styles.overlayBtn} onPress={() => setPaused(false)}>
            <Text style={styles.overlayBtnText}>RESUME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.overlayBtn, { backgroundColor: '#1e293b' }]} onPress={() => navigation.goBack()}>
            <Text style={styles.overlayBtnText}>QUIT</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Game Over */}
      {gameOver && (
        <View style={styles.overlay}>
          <Text style={[styles.overlayTitle, { color: '#ef4444' }]}>GAME OVER</Text>
          <Text style={styles.overlaySubtitle}>The infection spread...</Text>
          <Text style={styles.overlayScore}>Score: {score}</Text>
          <TouchableOpacity style={styles.overlayBtn} onPress={restart}>
            <Text style={styles.overlayBtnText}>TRY AGAIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.overlayBtn, { backgroundColor: '#1e293b' }]} onPress={() => navigation.goBack()}>
            <Text style={styles.overlayBtnText}>RETREAT</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Win screen */}
      {won && (
        <View style={styles.overlay}>
          <Text style={[styles.overlayTitle, { color: '#4ade80' }]}>INFECTION CLEARED!</Text>
          <Text style={styles.overlaySubtitle}>{levelData.name} System Protected</Text>
          <Text style={styles.overlayScore}>Score: {score}</Text>
          <Text style={styles.overlayAntibodies}>+{antibodies} ⬡ Antibodies</Text>
          <Text style={styles.overlayUnlock}>Next level unlocked!</Text>
          <TouchableOpacity style={[styles.overlayBtn, { backgroundColor: '#166534' }]} onPress={() => navigation.navigate('LevelSelect')}>
            <Text style={styles.overlayBtnText}>CONTINUE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.overlayBtn, { backgroundColor: '#1e3a5f' }]} onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.overlayBtnText}>VISIT SHOP</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hint popup */}
      {showHint && (
        <Modal transparent animationType="slide" onRequestClose={() => setShowHint(null)}>
          <View style={styles.hintBackdrop}>
            <View style={styles.hintCard}>
              <Text style={styles.hintTitle}>💡 {showHint.title}</Text>
              <Text style={styles.hintText}>{showHint.text}</Text>
              <TouchableOpacity style={styles.hintClose} onPress={() => setShowHint(null)}>
                <Text style={styles.hintCloseText}>GOT IT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  dpad: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dpadBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dpadText: { fontSize: 22, color: '#fff' },
  jumpBtn: {
    backgroundColor: 'rgba(96,165,250,0.3)',
    borderRadius: 26,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  jumpText: { fontSize: 22, color: '#60a5fa' },
  shootBtn: {
    backgroundColor: 'rgba(167,139,250,0.3)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  shootText: { fontSize: 16, color: '#a78bfa', fontWeight: '700' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  overlayTitle: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: 4 },
  overlaySubtitle: { color: '#94a3b8', fontSize: 16 },
  overlayScore: { color: '#fff', fontSize: 22, fontWeight: '700' },
  overlayAntibodies: { color: '#a78bfa', fontSize: 18, fontWeight: '700' },
  overlayUnlock: { color: '#4ade80', fontSize: 14 },
  overlayBtn: {
    backgroundColor: '#4361ee',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 180,
    alignItems: 'center',
  },
  overlayBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  hintBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  hintCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 24, maxWidth: 400, borderWidth: 1, borderColor: '#34d399', gap: 12 },
  hintTitle: { color: '#34d399', fontSize: 16, fontWeight: '900' },
  hintText: { color: '#e2e8f0', fontSize: 14, lineHeight: 22 },
  hintClose: { backgroundColor: '#052e16', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#34d399' },
  hintCloseText: { color: '#34d399', fontSize: 13, fontWeight: '700' },
});

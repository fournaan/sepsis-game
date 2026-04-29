import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const GRAVITY = 0.5;
export const JUMP_FORCE = -13;
export const PLAYER_SPEED = 4;
export const GROUND_Y = SCREEN_H - 80;

export function applyPhysics(entities, { time }) {
  const player = entities.player;
  if (!player) return entities;

  // Apply gravity
  player.velocity.y += GRAVITY;

  // Move player
  player.pos.x += player.velocity.x;
  player.pos.y += player.velocity.y;

  // Ground collision
  if (player.pos.y + player.size >= GROUND_Y) {
    player.pos.y = GROUND_Y - player.size;
    player.velocity.y = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  // Platform collisions
  const platforms = Object.values(entities).filter(e => e.type === 'platform');
  for (const plat of platforms) {
    if (
      player.velocity.y > 0 &&
      player.pos.x + player.size > plat.pos.x &&
      player.pos.x < plat.pos.x + plat.width &&
      player.pos.y + player.size >= plat.pos.y &&
      player.pos.y + player.size <= plat.pos.y + 20
    ) {
      player.pos.y = plat.pos.y - player.size;
      player.velocity.y = 0;
      player.grounded = true;
    }
  }

  // Ceiling
  if (player.pos.y < 0) {
    player.pos.y = 0;
    player.velocity.y = 0;
  }

  // Left wall
  if (player.pos.x < 0) player.pos.x = 0;

  return entities;
}

export function moveEnemies(entities, { time }) {
  const enemies = Object.entries(entities).filter(([k, e]) => e.type === 'enemy' && e.alive);

  for (const [key, enemy] of enemies) {
    enemy.pos.x += enemy.velocity.x;

    // Gravity on enemies
    enemy.velocity.y += GRAVITY;
    enemy.pos.y += enemy.velocity.y;

    // Ground
    if (enemy.pos.y + enemy.size >= GROUND_Y) {
      enemy.pos.y = GROUND_Y - enemy.size;
      enemy.velocity.y = 0;
    }

    // Bounce at screen edges
    if (enemy.pos.x <= 0 || enemy.pos.x + enemy.size >= SCREEN_W) {
      enemy.velocity.x *= -1;
    }
  }
  return entities;
}

export function moveProjectiles(entities) {
  const toDelete = [];
  for (const [key, e] of Object.entries(entities)) {
    if (e.type !== 'projectile') continue;
    e.pos.x += e.velocity.x;
    e.pos.y += e.velocity.y;
    if (e.pos.x < -20 || e.pos.x > SCREEN_W + 20 || e.pos.y < -20 || e.pos.y > SCREEN_H + 20) {
      toDelete.push(key);
    }
  }
  toDelete.forEach(k => delete entities[k]);
  return entities;
}

export { SCREEN_W, SCREEN_H };

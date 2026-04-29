import { Dimensions } from 'react-native';
const { width: W, height: H } = Dimensions.get('window');

// Level 2: Respiratory — constant airflow (horizontal wind force)
export function respiratoryAirflow(entities, { time }) {
  const player = entities.player;
  if (!player || !player.alive) return entities;

  // Simulate wind — alternates direction based on time
  const windPhase = Math.floor(time.current / 4000) % 2;
  const windForce = windPhase === 0 ? 0.8 : -0.5; // right-biased normally
  player.velocity.x += windForce;

  // Cap velocity to not be too crazy
  player.velocity.x = Math.max(-8, Math.min(8, player.velocity.x));
  return entities;
}

// Level 3: Gastrointestinal — peristalsis scrolls the ground
export function peristalsis(entities, { time }) {
  const t = time.current;
  const direction = Math.floor(t / 6000) % 2 === 0 ? 1 : -1;
  const scroll = direction * 0.6;

  const player = entities.player;
  if (player?.alive && player.grounded) {
    player.pos.x += scroll;
  }

  // Also move enemies with peristalsis
  for (const e of Object.values(entities)) {
    if (e.type === 'enemy' && e.alive) {
      e.pos.x += scroll * 0.5;
    }
  }
  return entities;
}

// Level 4: Urinary — visibility overlay (not a system, handled via overlay opacity in screen)
export function urinaryVisibility(entities, { time }) {
  // Progress through the level: visibility degrades
  const prog = Math.min(1, time.current / 60000);
  entities.__visibility = 1 - prog * 0.7; // from 1.0 → 0.3 over 60s
  return entities;
}

// Level 5: Musculoskeletal — fragile ground (osteoporotic tiles crumble)
export function fragileGround(entities, { time }) {
  const player = entities.player;
  if (!player) return entities;

  const fragiles = Object.entries(entities).filter(([k, e]) => e.type === 'platform' && e.fragile);
  for (const [key, plat] of fragiles) {
    if (!plat.crumble_start) continue;
    const elapsed = Date.now() - plat.crumble_start;
    if (elapsed > 600) delete entities[key]; // tile falls away
  }

  // Check if player is on a fragile platform
  for (const [key, plat] of fragiles) {
    if (!plat.crumble_start &&
      player.pos.x + player.size > plat.pos.x &&
      player.pos.x < plat.pos.x + plat.width &&
      Math.abs(player.pos.y + player.size - plat.pos.y) < 4
    ) {
      plat.crumble_start = Date.now(); // start crumbling
    }
  }
  return entities;
}

// Level 6: Cardiovascular — reduced gravity (bloodstream)
export function reducedGravity(entities) {
  // This just halves the GRAVITY constant effect by nudging upward
  const player = entities.player;
  if (player?.alive) {
    player.velocity.y -= 0.25; // counteract half gravity
  }
  for (const e of Object.values(entities)) {
    if (e.type === 'enemy' && e.alive) {
      e.velocity.y -= 0.15;
    }
  }
  return entities;
}

// Maps level ID → extra systems to inject
export const LEVEL_EXTRA_SYSTEMS = {
  2: [respiratoryAirflow],
  3: [peristalsis],
  4: [urinaryVisibility],
  5: [fragileGround],
  6: [reducedGravity],
};

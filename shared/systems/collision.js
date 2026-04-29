export function checkCollisions(entities, onEnemyHit, onPlayerHit) {
  const player = entities.player;
  if (!player || !player.alive) return entities;

  // Player vs enemies
  const enemies = Object.entries(entities).filter(([, e]) => e.type === 'enemy' && e.alive);
  for (const [key, enemy] of enemies) {
    if (circlesOverlap(player, enemy)) {
      onPlayerHit?.();
      break;
    }
  }

  // Projectiles vs enemies
  const projectiles = Object.entries(entities).filter(([, e]) => e.type === 'projectile' && e.fromPlayer);
  for (const [pKey, proj] of projectiles) {
    for (const [eKey, enemy] of enemies) {
      if (circlesOverlap(proj, enemy)) {
        enemy.health -= 1;
        delete entities[pKey];
        if (enemy.health <= 0) {
          enemy.alive = false;
          onEnemyHit?.(enemy);
        }
        break;
      }
    }
  }

  // Collectibles
  const collectibles = Object.entries(entities).filter(([, e]) => e.type === 'collectible' && !e.collected);
  for (const [key, coll] of collectibles) {
    if (circlesOverlap(player, coll)) {
      coll.collected = true;
      coll.onCollect?.();
    }
  }

  return entities;
}

function circlesOverlap(a, b) {
  const aR = a.size / 2;
  const bR = b.size / 2;
  const dx = (a.pos.x + aR) - (b.pos.x + bR);
  const dy = (a.pos.y + aR) - (b.pos.y + bR);
  return Math.sqrt(dx * dx + dy * dy) < aR + bR;
}

import React from 'react';
import { View, Text } from 'react-native';

export function PlayerRenderer({ pos, size, scale, invincible, alive }) {
  if (!alive) return null;
  const s = size * (scale || 1);
  return (
    <View
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: s,
        height: s,
        borderRadius: s / 2,
        backgroundColor: invincible ? '#f0f' : '#60a5fa',
        opacity: invincible ? 0.6 : 1,
        borderWidth: 2,
        borderColor: '#93c5fd',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#60a5fa',
        shadowRadius: 8,
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 0 },
        elevation: 5,
      }}
    >
      {/* nucleus */}
      <View style={{
        width: s * 0.4,
        height: s * 0.4,
        borderRadius: s * 0.2,
        backgroundColor: '#1d4ed8',
      }} />
    </View>
  );
}

export function EnemyRenderer({ pos, size, color, health, maxHealth, alive, name }) {
  if (!alive) return null;
  return (
    <View style={{ position: 'absolute', left: pos.x, top: pos.y - 18 }}>
      {/* health bar */}
      <View style={{ width: size, height: 5, backgroundColor: '#333', borderRadius: 3, marginBottom: 3 }}>
        <View style={{
          width: `${(health / maxHealth) * 100}%`,
          height: '100%',
          backgroundColor: '#ef4444',
          borderRadius: 3,
        }} />
      </View>
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: 2,
        borderColor: '#fff',
        opacity: 0.85,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: size * 0.15,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }} />
      </View>
    </View>
  );
}

export function ProjectileRenderer({ pos, size, fromPlayer }) {
  return (
    <View style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: fromPlayer ? '#a78bfa' : '#ef4444',
      shadowColor: fromPlayer ? '#a78bfa' : '#ef4444',
      shadowRadius: 4,
      shadowOpacity: 0.8,
      shadowOffset: { width: 0, height: 0 },
      elevation: 3,
    }} />
  );
}

export function PlatformRenderer({ pos, width, height, color }) {
  return (
    <View style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width,
      height: height || 16,
      backgroundColor: color || '#334155',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#475569',
    }} />
  );
}

export function GroundRenderer({ pos, width, height }) {
  return (
    <View style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width,
      height: height || 80,
      backgroundColor: '#1e293b',
      borderTopWidth: 2,
      borderTopColor: '#475569',
    }} />
  );
}

export function CollectibleRenderer({ pos, size, kind, collected }) {
  if (collected) return null;
  const colors = {
    antibiotic: '#a78bfa',
    powerup_macrophage: '#f77f00',
    powerup_filgrastim: '#4cc9f0',
    powerup_steroid: '#f72585',
    antibody: '#fbbf24',
    hint: '#34d399',
  };
  const color = colors[kind] || '#fff';
  return (
    <View style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      borderWidth: 2,
      borderColor: '#fff',
      opacity: 0.9,
      shadowColor: color,
      shadowRadius: 6,
      shadowOpacity: 0.9,
      shadowOffset: { width: 0, height: 0 },
      elevation: 4,
    }}>
      <Text style={{
        color: '#fff',
        fontSize: size * 0.5,
        textAlign: 'center',
        lineHeight: size - 2,
        fontWeight: '900',
      }}>
        {kind === 'antibody' ? '⬡' : kind === 'hint' ? '?' : '+'}
      </Text>
    </View>
  );
}

export function SoldierTCellRenderer({ pos, size }) {
  return (
    <View style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#38bdf8',
      borderWidth: 1,
      borderColor: '#7dd3fc',
      opacity: 0.8,
    }} />
  );
}

// Maps entity type → renderer component
export const RENDERERS = {
  player: PlayerRenderer,
  enemy: EnemyRenderer,
  projectile: ProjectileRenderer,
  platform: PlatformRenderer,
  ground: GroundRenderer,
  collectible: CollectibleRenderer,
  soldier: SoldierTCellRenderer,
};

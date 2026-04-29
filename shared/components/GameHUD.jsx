import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HealthBar from './HealthBar';
import AntibodyCounter from './AntibodyCounter';

export default function GameHUD({
  health, maxHealth, antibodies, score, levelName, activePowerUp, immunoMode, onPause,
}) {
  return (
    <View style={styles.hud} pointerEvents="box-none">
      <View style={styles.topLeft}>
        <HealthBar current={health} max={maxHealth} immunoMode={immunoMode} />
        <AntibodyCounter count={antibodies} />
      </View>

      <View style={styles.topCenter}>
        <Text style={styles.levelName}>{levelName}</Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <View style={styles.topRight}>
        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseText}>⏸</Text>
        </TouchableOpacity>
      </View>

      {activePowerUp && (
        <View style={styles.powerUpBanner}>
          <Text style={styles.powerUpText}>{activePowerUp.name} ACTIVE</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    zIndex: 100,
  },
  topLeft: { gap: 4 },
  topCenter: { alignItems: 'center' },
  topRight: {},
  levelName: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  score: { color: '#fff', fontSize: 16, fontWeight: '900' },
  pauseButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 8,
  },
  pauseText: { fontSize: 20 },
  powerUpBanner: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  powerUpText: {
    backgroundColor: 'rgba(247,37,133,0.8)',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    letterSpacing: 2,
  },
});

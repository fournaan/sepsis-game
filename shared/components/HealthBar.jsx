import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HealthBar({ current, max, immunoMode }) {
  const pct = Math.max(0, Math.min(1, current / max));
  const color = pct > 0.5 ? '#4ade80' : pct > 0.25 ? '#facc15' : '#ef4444';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{immunoMode ? 'WBC: CRITICAL' : `WBC: ${current}/${max}`}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  label: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  track: { height: 10, backgroundColor: '#333', borderRadius: 5, overflow: 'hidden', width: 120 },
  fill: { height: '100%', borderRadius: 5 },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AntibodyCounter({ count }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⬡</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  icon: { color: '#a78bfa', fontSize: 16 },
  count: { color: '#a78bfa', fontSize: 14, fontWeight: 'bold' },
});

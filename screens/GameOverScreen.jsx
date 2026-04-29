import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function GameOverScreen({ navigation, route }) {
  const { score = 0, levelId = 1 } = route?.params || {};

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.title}>GAME OVER</Text>
      <Text style={styles.sub}>The infection was too strong...</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Game', { levelId })}>
        <Text style={styles.btnText}>TRY AGAIN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => navigation.navigate('LevelSelect')}>
        <Text style={styles.btnText}>LEVEL SELECT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1e', alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { color: '#ef4444', fontSize: 42, fontWeight: '900', letterSpacing: 6 },
  sub: { color: '#94a3b8', fontSize: 16 },
  score: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  btn: { backgroundColor: '#4361ee', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 10, minWidth: 200, alignItems: 'center' },
  btnSecondary: { backgroundColor: '#1e293b' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
});

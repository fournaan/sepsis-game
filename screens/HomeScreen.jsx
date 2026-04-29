import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar } from 'react-native';
import { useGame } from '../shared/GameContext';

export default function HomeScreen({ navigation }) {
  const { state } = useGame();
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const glowColor = glow.interpolate({ inputRange: [0, 1], outputRange: ['#1a1a3e', '#0d1b5e'] });

  return (
    <Animated.View style={[styles.container, { backgroundColor: glowColor }]}>
      <StatusBar hidden />

      {/* Floating cells background */}
      <View style={styles.bgCells}>
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[styles.bgCell, {
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              width: 20 + (i % 4) * 8,
              height: 20 + (i % 4) * 8,
              opacity: 0.15 + (i % 3) * 0.05,
            }]}
          />
        ))}
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Animated.Text style={[styles.title, { transform: [{ scale: pulse }] }]}>
          SEPSIS
        </Animated.Text>
        <Text style={styles.subtitle}>Killer T Cell Chronicles</Text>
        <Text style={styles.tagline}>Save the body. Learn the science.</Text>
      </View>

      {/* T-Cell hero */}
      <View style={styles.heroContainer}>
        <Animated.View style={[styles.tCell, { transform: [{ scale: pulse }] }]}>
          <View style={styles.tCellInner} />
          <View style={styles.tCellNucleus} />
        </Animated.View>
        <Text style={styles.heroLabel}>Killer T Cell</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('LevelSelect')}
          activeOpacity={0.8}
        >
          <Text style={styles.playButtonText}>PLAY</Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.secondaryButtonText}>SHOP</Text>
            <Text style={styles.secondaryButtonSub}>{state.antibodies} ⬡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Collectables')}
          >
            <Text style={styles.secondaryButtonText}>LIBRARY</Text>
            <Text style={styles.secondaryButtonSub}>Bacteria & Meds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.secondaryButtonText}>SETTINGS</Text>
            {state.immunodeficiencyMode && (
              <Text style={[styles.secondaryButtonSub, { color: '#ef4444' }]}>IMMUNO ON</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  bgCells: { ...StyleSheet.absoluteFillObject },
  bgCell: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#4361ee',
  },
  titleContainer: { flex: 1, alignItems: 'flex-start', justifyContent: 'center' },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 8,
    textShadowColor: '#4361ee',
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: { fontSize: 18, color: '#a78bfa', fontWeight: '600', marginTop: 4 },
  tagline: { fontSize: 13, color: '#64748b', marginTop: 8, fontStyle: 'italic' },
  heroContainer: { alignItems: 'center', justifyContent: 'center', marginHorizontal: 30 },
  tCell: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#60a5fa',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#60a5fa',
    shadowRadius: 20,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  tCellInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
  },
  tCellNucleus: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1d4ed8',
  },
  heroLabel: { color: '#93c5fd', fontSize: 12, marginTop: 8, fontWeight: '600' },
  buttons: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', gap: 12 },
  playButton: {
    backgroundColor: '#4361ee',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4361ee',
    shadowRadius: 15,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  playButtonText: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 4 },
  secondaryButtons: { flexDirection: 'row', gap: 10 },
  secondaryButton: {
    backgroundColor: '#1e1e3e',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  secondaryButtonText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  secondaryButtonSub: { color: '#475569', fontSize: 10, marginTop: 2 },
});

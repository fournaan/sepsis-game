import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, StatusBar } from 'react-native';
import { useGame } from '../shared/GameContext';

export default function SettingsScreen({ navigation }) {
  const { state, dispatch } = useGame();

  function confirmReset() {
    Alert.alert(
      'Reset All Progress',
      'This will delete all antibodies, unlocks, and high scores. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_SAVE' }) },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SETTINGS</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>DIFFICULTY</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>Immunodeficiency Mode</Text>
            <Text style={styles.rowDesc}>WBC locked to 1 for all levels. Extreme difficulty.</Text>
          </View>
          <Switch
            value={state.immunodeficiencyMode}
            onValueChange={() => dispatch({ type: 'TOGGLE_IMMUNODEFICIENCY' })}
            trackColor={{ false: '#1e293b', true: '#ef4444' }}
            thumbColor={state.immunodeficiencyMode ? '#fff' : '#64748b'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>STATS</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Antibodies Earned</Text>
          <Text style={styles.statValue}>⬡ {state.totalAntibodiesEarned}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Levels Unlocked</Text>
          <Text style={styles.statValue}>{state.levelsUnlocked.length} / 6</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Antibiotics Collected</Text>
          <Text style={styles.statValue}>{state.antibioticsUnlocked.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Enemy Cards</Text>
          <Text style={styles.statValue}>{state.enemyCardsUnlocked.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Hints Unlocked</Text>
          <Text style={styles.statValue}>{state.hintsUnlocked.length} / 12</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>DATA</Text>
        <TouchableOpacity style={styles.resetButton} onPress={confirmReset}>
          <Text style={styles.resetText}>Reset All Progress</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sepsis v1.0 — Killer T Cell Chronicles</Text>
        <Text style={styles.footerSub}>Educational content for entertainment purposes.</Text>
        <Text style={styles.footerSub}>Not a substitute for medical advice.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1e' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  back: { padding: 4 },
  backText: { color: '#4361ee', fontSize: 14, fontWeight: '700' },
  title: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  section: {
    margin: 16,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  sectionLabel: {
    color: '#4361ee', fontSize: 11, fontWeight: '700',
    padding: 12, paddingBottom: 8, letterSpacing: 2,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
  },
  rowLeft: { flex: 1 },
  rowTitle: { color: '#e2e8f0', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  rowDesc: { color: '#64748b', fontSize: 12 },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  statLabel: { color: '#94a3b8', fontSize: 13 },
  statValue: { color: '#fff', fontSize: 13, fontWeight: '700' },
  resetButton: {
    margin: 12, backgroundColor: '#1a0000', borderRadius: 8,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444',
  },
  resetText: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
  footer: { padding: 20, alignItems: 'center', gap: 4 },
  footerText: { color: '#334155', fontSize: 13 },
  footerSub: { color: '#1e293b', fontSize: 11 },
});

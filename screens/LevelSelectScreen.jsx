import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useGame } from '../shared/GameContext';
import { LEVELS } from '../shared/gameData';

export default function LevelSelectScreen({ navigation }) {
  const { state } = useGame();

  function handleLevelPress(level) {
    if (!state.levelsUnlocked.includes(level.id)) return;
    navigation.navigate('Game', { levelId: level.id });
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SELECT WORLD</Text>
        <Text style={styles.antibodies}>⬡ {state.antibodies}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {LEVELS.map(level => {
          const unlocked = state.levelsUnlocked.includes(level.id);
          const score = state.highScores[level.id] || 0;

          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.card,
                { borderColor: unlocked ? level.color : '#333' },
                !unlocked && styles.cardLocked,
              ]}
              onPress={() => handleLevelPress(level)}
              activeOpacity={unlocked ? 0.8 : 1}
            >
              {/* Level number badge */}
              <View style={[styles.badge, { backgroundColor: unlocked ? level.color : '#333' }]}>
                <Text style={styles.badgeText}>{level.id}</Text>
              </View>

              {/* Lock overlay */}
              {!unlocked && (
                <View style={styles.lockOverlay}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <Text style={[styles.systemName, { color: unlocked ? level.color : '#555' }]}>
                  {level.name.toUpperCase()}
                </Text>
                <Text style={[styles.bossName, { color: unlocked ? '#e2e8f0' : '#444' }]}>
                  {level.subtitle}
                </Text>
                <Text style={[styles.desc, { color: unlocked ? '#94a3b8' : '#333' }]} numberOfLines={2}>
                  {level.description}
                </Text>
                {unlocked && score > 0 && (
                  <Text style={[styles.score, { color: level.color }]}>Best: {score}</Text>
                )}
              </View>

              {/* Body system indicator cells */}
              <View style={styles.cellsDecor}>
                {[...Array(3)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.decorCell,
                      { backgroundColor: unlocked ? level.color : '#333', opacity: 0.3 - i * 0.08 },
                    ]}
                  />
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {state.levelsUnlocked.length} / {LEVELS.length} worlds unlocked
        </Text>
        {state.immunodeficiencyMode && (
          <Text style={styles.immunoBadge}>IMMUNODEFICIENCY MODE ACTIVE</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1e' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  back: { padding: 4 },
  backText: { color: '#4361ee', fontSize: 14, fontWeight: '700' },
  title: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 3 },
  antibodies: { color: '#a78bfa', fontSize: 16, fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    width: 200,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  cardLocked: { opacity: 0.6 },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  lockIcon: { fontSize: 18 },
  cardContent: { padding: 14, paddingTop: 44 },
  systemName: { fontSize: 15, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  bossName: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  desc: { fontSize: 11, lineHeight: 16 },
  score: { fontSize: 11, fontWeight: '700', marginTop: 8 },
  cellsDecor: {
    flexDirection: 'row',
    gap: 4,
    padding: 10,
    justifyContent: 'flex-end',
  },
  decorCell: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    gap: 4,
  },
  footerText: { color: '#475569', fontSize: 12 },
  immunoBadge: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#1a0000',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
});

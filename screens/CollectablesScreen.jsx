import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Modal } from 'react-native';
import { useGame } from '../shared/GameContext';
import { ENEMIES, HINTS, MCS_REPORTS, ANTIBIOTICS } from '../shared/gameData';

export default function CollectablesScreen({ navigation }) {
  const { state } = useGame();
  const [tab, setTab] = useState('chart');
  const [selected, setSelected] = useState(null);

  const enemyEntries = Object.values(ENEMIES);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>LIBRARY</Text>
      </View>

      <View style={styles.tabs}>
        {['chart', 'bacteria', 'mcs', 'hints'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'chart' ? 'Coverage Chart' : t === 'bacteria' ? 'Bacteria Cards' : t === 'mcs' ? 'MCS Reports' : 'Hints'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Antibiotic Coverage Chart */}
        {tab === 'chart' && (
          <View>
            <Text style={styles.sectionTitle}>
              Antibiotic Coverage Map — {state.coverageChartPieces.length}/{ANTIBIOTICS.length} unlocked
            </Text>
            <View style={styles.chartGrid}>
              {ANTIBIOTICS.map(ab => {
                const unlocked = state.coverageChartPieces.includes(ab.id);
                return (
                  <TouchableOpacity
                    key={ab.id}
                    style={[styles.chartCell, unlocked ? styles.chartCellUnlocked : styles.chartCellLocked]}
                    onPress={() => unlocked && setSelected({ type: 'antibiotic', data: ab })}
                  >
                    {unlocked ? (
                      <>
                        <Text style={styles.chartCellName} numberOfLines={2}>{ab.name}</Text>
                        <Text style={styles.chartCellClass} numberOfLines={1}>{ab.class.split('(')[0]}</Text>
                      </>
                    ) : (
                      <Text style={styles.chartCellLock}>?</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Bacteria Cards */}
        {tab === 'bacteria' && (
          <View style={styles.cardGrid}>
            {enemyEntries.map(enemy => {
              const unlocked = state.enemyCardsUnlocked.includes(enemy.id);
              return (
                <TouchableOpacity
                  key={enemy.id}
                  style={[styles.enemyCard, unlocked ? { borderColor: enemy.color } : styles.cardLocked]}
                  onPress={() => unlocked && setSelected({ type: 'enemy', data: enemy })}
                >
                  <View style={[styles.enemyIcon, { backgroundColor: enemy.color }]}>
                    <Text style={styles.enemyIconText}>{unlocked ? enemy.name[0] : '?'}</Text>
                  </View>
                  <Text style={[styles.enemyCardName, { color: unlocked ? enemy.color : '#333' }]} numberOfLines={2}>
                    {unlocked ? enemy.name : '???'}
                  </Text>
                  {unlocked && (
                    <Text style={styles.enemyCardGram} numberOfLines={1}>{enemy.gramStain}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* MCS Reports */}
        {tab === 'mcs' && MCS_REPORTS.map(report => {
          const unlocked = state.mcsReportsUnlocked.includes(report.id);
          return (
            <TouchableOpacity
              key={report.id}
              style={[styles.mcsCard, !unlocked && styles.cardLocked]}
              onPress={() => unlocked && setSelected({ type: 'mcs', data: report })}
            >
              <Text style={styles.mcsTitle}>{unlocked ? report.title : '??? — Level ' + report.level}</Text>
              {unlocked && <Text style={styles.mcsOrganism}>{report.organism}</Text>}
            </TouchableOpacity>
          );
        })}

        {/* Hints */}
        {tab === 'hints' && HINTS.map(hint => {
          const unlocked = state.hintsUnlocked.includes(hint.id);
          return (
            <View key={hint.id} style={[styles.hintCard, !unlocked && styles.cardLocked]}>
              <Text style={styles.hintTitle}>{unlocked ? hint.title : '??? — Level ' + hint.level}</Text>
              {unlocked && <Text style={styles.hintText}>{hint.text}</Text>}
            </View>
          );
        })}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setSelected(null)} activeOpacity={1}>
          <View style={styles.modalCard}>
            {selected?.type === 'antibiotic' && (
              <>
                <Text style={styles.modalTitle}>{selected.data.name}</Text>
                <Text style={styles.modalClass}>{selected.data.class}</Text>
                <Text style={styles.modalDesc}>{selected.data.description}</Text>
                <Text style={styles.modalSectionLabel}>Coverage:</Text>
                {selected.data.coverage.map((c, i) => (
                  <Text key={i} style={styles.modalListItem}>• {c}</Text>
                ))}
              </>
            )}
            {selected?.type === 'enemy' && (
              <>
                <Text style={styles.modalTitle}>{selected.data.name}</Text>
                <Text style={styles.modalClass}>{selected.data.gramStain}</Text>
                <Text style={styles.modalDesc}>{selected.data.description}</Text>
                <Text style={styles.modalSectionLabel}>First-line treatment:</Text>
                <Text style={styles.modalListItem}>{selected.data.firstLine}</Text>
              </>
            )}
            {selected?.type === 'mcs' && (
              <>
                <Text style={styles.modalTitle}>{selected.data.title}</Text>
                <Text style={styles.modalClass}>{selected.data.organism}</Text>
                <Text style={styles.modalSectionLabel}>Sensitive:</Text>
                {selected.data.sensitive.map((s, i) => (
                  <Text key={i} style={[styles.modalListItem, { color: '#4ade80' }]}>✓ {s}</Text>
                ))}
                <Text style={styles.modalSectionLabel}>Resistant:</Text>
                {selected.data.resistant.map((r, i) => (
                  <Text key={i} style={[styles.modalListItem, { color: '#ef4444' }]}>✗ {r}</Text>
                ))}
                <Text style={[styles.modalDesc, { marginTop: 10 }]}>{selected.data.recommendation}</Text>
              </>
            )}
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
              <Text style={styles.modalCloseText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#4361ee' },
  tabText: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  tabTextActive: { color: '#4361ee' },
  content: { padding: 16, gap: 10 },
  sectionTitle: { color: '#94a3b8', fontSize: 13, marginBottom: 12 },
  chartGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chartCell: { width: 110, height: 70, borderRadius: 8, padding: 8, justifyContent: 'center' },
  chartCellUnlocked: { backgroundColor: '#1e2a4a', borderWidth: 1, borderColor: '#4361ee' },
  chartCellLocked: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b' },
  chartCellName: { color: '#e2e8f0', fontSize: 10, fontWeight: '700', marginBottom: 2 },
  chartCellClass: { color: '#64748b', fontSize: 9 },
  chartCellLock: { color: '#334155', fontSize: 24, textAlign: 'center' },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  enemyCard: { width: 120, backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1.5, padding: 10, alignItems: 'center', gap: 6 },
  cardLocked: { borderColor: '#1e293b', opacity: 0.4 },
  enemyIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  enemyIconText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  enemyCardName: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  enemyCardGram: { fontSize: 9, color: '#64748b', textAlign: 'center' },
  mcsCard: { backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: '#1e3a5f', padding: 14, gap: 4 },
  mcsTitle: { color: '#e2e8f0', fontSize: 14, fontWeight: '700' },
  mcsOrganism: { color: '#64748b', fontSize: 11 },
  hintCard: { backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: '#1e3a5f', padding: 14, gap: 6 },
  hintTitle: { color: '#a78bfa', fontSize: 13, fontWeight: '700' },
  hintText: { color: '#94a3b8', fontSize: 12, lineHeight: 18 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: '#334155', gap: 6 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 4 },
  modalClass: { color: '#a78bfa', fontSize: 12, marginBottom: 8 },
  modalDesc: { color: '#94a3b8', fontSize: 13, lineHeight: 20 },
  modalSectionLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', marginTop: 10, textTransform: 'uppercase' },
  modalListItem: { color: '#e2e8f0', fontSize: 13 },
  modalClose: { marginTop: 16, backgroundColor: '#1e293b', borderRadius: 8, padding: 12, alignItems: 'center' },
  modalCloseText: { color: '#94a3b8', fontSize: 14, fontWeight: '700' },
});

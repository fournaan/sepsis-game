import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { useGame } from '../shared/GameContext';
import { ANTIBIOTICS } from '../shared/gameData';

export default function ShopScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const [selectedTab, setSelectedTab] = useState('antibiotics');

  function buyAntibiotic(ab) {
    if (state.antibioticsUnlocked.includes(ab.id)) return;
    if (state.antibodies < ab.cost) {
      Alert.alert('Not enough Antibodies', `You need ${ab.cost} antibodies. You have ${state.antibodies}.`);
      return;
    }
    dispatch({ type: 'SPEND_ANTIBODIES', amount: ab.cost });
    dispatch({ type: 'UNLOCK_ANTIBIOTIC', id: ab.id });
    Alert.alert('Unlocked!', `${ab.name} added to your arsenal.`);
  }

  const available = ANTIBIOTICS.filter(ab =>
    state.levelsUnlocked.includes(ab.level) || ab.level <= Math.max(...state.levelsUnlocked)
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ANTIBIOTIC SHOP</Text>
        <View style={styles.currency}>
          <Text style={styles.currencyText}>⬡ {state.antibodies}</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'antibiotics' && styles.tabActive]}
          onPress={() => setSelectedTab('antibiotics')}
        >
          <Text style={[styles.tabText, selectedTab === 'antibiotics' && styles.tabTextActive]}>
            Antibiotics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'specials' && styles.tabActive]}
          onPress={() => setSelectedTab('specials')}
        >
          <Text style={[styles.tabText, selectedTab === 'specials' && styles.tabTextActive]}>
            Special Items
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ gap: 10, padding: 16 }}>
        {selectedTab === 'antibiotics' && available.map(ab => {
          const owned = state.antibioticsUnlocked.includes(ab.id);
          const locked = !state.levelsUnlocked.includes(ab.level) && ab.level > 1;

          return (
            <View key={ab.id} style={[styles.card, owned && styles.cardOwned, locked && styles.cardLocked]}>
              <View style={styles.cardLeft}>
                <Text style={styles.abName}>{ab.name}</Text>
                <Text style={styles.abClass}>{ab.class}</Text>
                <Text style={styles.abDesc}>{ab.description}</Text>
                <View style={styles.coverageRow}>
                  {ab.coverage.slice(0, 3).map((c, i) => (
                    <View key={i} style={styles.coverageTag}>
                      <Text style={styles.coverageTagText}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.cardRight}>
                {owned ? (
                  <View style={styles.ownedBadge}>
                    <Text style={styles.ownedText}>OWNED</Text>
                  </View>
                ) : locked ? (
                  <Text style={styles.lockedText}>🔒 Level {ab.level}</Text>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      state.antibodies < ab.cost && styles.buyButtonDisabled,
                    ]}
                    onPress={() => buyAntibiotic(ab)}
                  >
                    <Text style={styles.buyText}>
                      {ab.cost === 0 ? 'FREE' : `⬡ ${ab.cost}`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {selectedTab === 'specials' && (
          <View style={styles.specialCard}>
            <Text style={styles.abName}>Probenecid</Text>
            <Text style={styles.abClass}>Beta-lactam sparer / Uricosuric</Text>
            <Text style={styles.abDesc}>
              Blocks tubular secretion of penicillin — extends its duration. Educational bonus item.
              Also used in gout treatment.
            </Text>
            <TouchableOpacity
              style={[styles.buyButton, state.antibodies < 150 && styles.buyButtonDisabled]}
              onPress={() => {
                if (state.antibodies < 150) {
                  Alert.alert('Need 150 antibodies');
                  return;
                }
                dispatch({ type: 'SPEND_ANTIBODIES', amount: 150 });
                Alert.alert('Probenecid unlocked!', 'Duration of all beta-lactam weapons extended by 50%.');
              }}
            >
              <Text style={styles.buyText}>⬡ 150</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  currency: { backgroundColor: '#1e1e3e', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  currencyText: { color: '#a78bfa', fontSize: 16, fontWeight: '700' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#4361ee' },
  tabText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#4361ee' },
  list: { flex: 1 },
  card: {
    backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#1e293b',
    flexDirection: 'row', padding: 14, alignItems: 'center',
  },
  cardOwned: { borderColor: '#4ade80', opacity: 0.7 },
  cardLocked: { opacity: 0.4 },
  cardLeft: { flex: 1 },
  abName: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 2 },
  abClass: { color: '#a78bfa', fontSize: 11, marginBottom: 6 },
  abDesc: { color: '#64748b', fontSize: 11, lineHeight: 16, marginBottom: 8 },
  coverageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  coverageTag: { backgroundColor: '#1e3a5f', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  coverageTagText: { color: '#60a5fa', fontSize: 10 },
  cardRight: { marginLeft: 12, alignItems: 'center' },
  ownedBadge: { backgroundColor: '#052e16', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#4ade80' },
  ownedText: { color: '#4ade80', fontSize: 11, fontWeight: '700' },
  lockedText: { color: '#475569', fontSize: 12 },
  buyButton: { backgroundColor: '#4361ee', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  buyButtonDisabled: { backgroundColor: '#1e2a4a', opacity: 0.5 },
  buyText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  specialCard: { backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#f4a261', padding: 14, gap: 8 },
});

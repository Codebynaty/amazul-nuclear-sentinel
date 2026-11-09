import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import OccurrenceCard from '../components/OccurrenceCard';
import { useAuth } from '../context/AuthContext';
import { ALERT_LABEL } from '../data/catalog';
import { ScreenProps } from '../navigation/types';
import { listOccurrences, resetOccurrences } from '../services/occurrenceService';
import { ROLE_LABEL } from '../services/permissions';
import { alertColors, colors, spacing } from '../theme';
import { AlertLevel, Occurrence } from '../types';

type Filter = AlertLevel | 'todas';
const LEVELS: AlertLevel[] = ['critica', 'atipica', 'normal'];

export default function OccurrenceListScreen({ navigation }: ScreenProps<'OccurrenceList'>) {
  const { session, signOut, hasPermission } = useAuth();
  const [items, setItems] = useState<Occurrence[]>([]);
  const [filter, setFilter] = useState<Filter>('todas');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    setItems(await listOccurrences());
    setRefreshing(false);
  }, []);

  // Recarrega sempre que a tela volta ao foco (após cadastro/alteração)
  useFocusEffect(useCallback(() => { load(); }, [load]));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => Alert.alert('Sair', 'Deseja encerrar a sessão?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: signOut },
        ])}>
          <Text style={{ color: colors.danger, fontWeight: '700' }}>Sair</Text>
        </Pressable>
      ),
    });
  }, [navigation, signOut]);

  const counts = useMemo(() => {
    const c: Record<AlertLevel, number> = { normal: 0, atipica: 0, critica: 0 };
    items.forEach((i) => c[i.nivelAlerta]++);
    return c;
  }, [items]);

  const visible = filter === 'todas' ? items : items.filter((i) => i.nivelAlerta === filter);

  return (
    <View style={styles.container}>
      <View style={styles.userBar}>
        <Text style={styles.userText}>{session?.user.nome}</Text>
        <Text style={styles.roleText}>{session && ROLE_LABEL[session.user.papel]} · {session?.user.matricula}</Text>
      </View>

      <View style={styles.summary}>
        {LEVELS.map((l) => (
          <Pressable key={l} onPress={() => setFilter(filter === l ? 'todas' : l)}
            style={[styles.summaryBox, { borderColor: alertColors[l].fg, backgroundColor: filter === l ? alertColors[l].bg : colors.surface }]}>
            <Text style={[styles.summaryNum, { color: alertColors[l].fg }]}>{counts[l]}</Text>
            <Text style={styles.summaryLabel}>{ALERT_LABEL[l]}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.filterInfo}>
        {filter === 'todas' ? `Todas as ocorrências (${items.length})` : `Filtro: ${ALERT_LABEL[filter]} — toque novamente para limpar`}
      </Text>

      <FlatList
        data={visible}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />}
        renderItem={({ item }) => <OccurrenceCard item={item} onPress={() => navigation.navigate('OccurrenceDetail', { id: item.id })} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma ocorrência encontrada.</Text>}
        ListFooterComponent={hasPermission('ocorrencia:excluir') ? (
          <Pressable onPress={async () => { await resetOccurrences(); load(); }}>
            <Text style={styles.reset}>Restaurar catálogo inicial (supervisor)</Text>
          </Pressable>
        ) : undefined}
      />

      {hasPermission('ocorrencia:criar') && (
        <Pressable style={styles.fab} onPress={() => navigation.navigate('OccurrenceForm')} accessibilityLabel="Nova ocorrência">
          <Text style={styles.fabText}>＋ Nova ocorrência</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing(4), paddingTop: spacing(3) },
  userBar: { marginBottom: spacing(3) },
  userText: { color: colors.text, fontWeight: '700', fontSize: 16 },
  roleText: { color: colors.textMuted, fontSize: 13 },
  summary: { flexDirection: 'row', gap: spacing(2), marginBottom: spacing(2) },
  summaryBox: { flex: 1, borderWidth: 1, borderRadius: 12, padding: spacing(3), alignItems: 'center' },
  summaryNum: { fontSize: 24, fontWeight: '800' },
  summaryLabel: { color: colors.textMuted, fontSize: 12 },
  filterInfo: { color: colors.textMuted, fontSize: 12, marginBottom: spacing(3) },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing(10) },
  reset: { color: colors.textMuted, textAlign: 'center', textDecorationLine: 'underline', marginTop: spacing(2) },
  fab: { position: 'absolute', right: spacing(4), bottom: spacing(6), backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: spacing(5), paddingVertical: spacing(3.5), elevation: 4 },
  fabText: { color: '#fff', fontWeight: '800' },
});

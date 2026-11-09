import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTypeInfo } from '../data/catalog';
import { alertColors, colors, spacing } from '../theme';
import { Occurrence } from '../types';
import { formatDateTime } from '../utils/format';
import AlertBadge from './AlertBadge';
import StatusBadge from './StatusBadge';

export default function OccurrenceCard({ item, onPress }: { item: Occurrence; onPress: () => void }) {
  const info = getTypeInfo(item.tipo);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { borderLeftColor: alertColors[item.nivelAlerta].fg, opacity: pressed ? 0.8 : 1 }]}>
      <View style={styles.header}>
        <AlertBadge level={item.nivelAlerta} />
        <StatusBadge status={item.status} />
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.titulo}</Text>
      <Text style={styles.meta}>
        {item.setor} · {info.label}
        {item.valorMedido !== undefined && info.unidade ? ` · ${item.valorMedido} ${info.unidade}` : ''}
      </Text>
      <Text style={styles.date}>{formatDateTime(item.criadoEm)} · {item.registradoPor.nome}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing(4), marginBottom: spacing(3), borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing(2) },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing(1) },
  meta: { color: colors.textMuted, fontSize: 13 },
  date: { color: colors.textMuted, fontSize: 12, marginTop: spacing(1.5) },
});

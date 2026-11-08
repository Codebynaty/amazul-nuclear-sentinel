import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { STATUS_LABEL } from '../data/catalog';
import { colors, spacing } from '../theme';
import { OccurrenceStatus } from '../types';

const STATUS_COLOR: Record<OccurrenceStatus, string> = {
  aberta: colors.primary,
  em_analise: colors.warning,
  resolvida: colors.success,
};

export default function StatusBadge({ status }: { status: OccurrenceStatus }) {
  return <Text style={[styles.text, { color: STATUS_COLOR[status], borderColor: STATUS_COLOR[status] }]}>{STATUS_LABEL[status]}</Text>;
}

const styles = StyleSheet.create({
  text: { fontSize: 11, fontWeight: '700', borderWidth: 1, borderRadius: 6, paddingHorizontal: spacing(2), paddingVertical: spacing(0.5), overflow: 'hidden' },
});

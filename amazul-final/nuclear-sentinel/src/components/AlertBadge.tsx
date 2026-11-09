import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ALERT_LABEL } from '../data/catalog';
import { alertColors, spacing } from '../theme';
import { AlertLevel } from '../types';

export default function AlertBadge({ level }: { level: AlertLevel }) {
  const c = alertColors[level];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.fg }]}>
      <View style={[styles.dot, { backgroundColor: c.fg }]} />
      <Text style={[styles.text, { color: c.fg }]}>{ALERT_LABEL[level].toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: spacing(2.5), paddingVertical: spacing(1) },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing(1.5) },
  text: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
});

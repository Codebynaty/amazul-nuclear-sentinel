import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label: string;
  options: Option<T>[];
  value: T | '';
  onChange: (v: T) => void;
  error?: string;
  required?: boolean;
}

/** Seletor em "chips" — genérico e tipado. */
export default function OptionPicker<T extends string>({ label, options, value, onChange, error, required }: Props<T>) {
  return (
    <View style={{ marginBottom: spacing(4) }}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={{ color: colors.danger }}> *</Text>}
      </Text>
      <View style={styles.row}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              style={[styles.chip, active && styles.chipActive, !!error && !value && { borderColor: colors.danger }]}
            >
              <Text style={[styles.chipText, active && { color: '#fff' }]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.text, fontWeight: '600', marginBottom: spacing(1.5) },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: spacing(3), paddingVertical: spacing(2), backgroundColor: colors.surfaceAlt },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  error: { color: colors.danger, marginTop: spacing(1), fontSize: 13 },
});

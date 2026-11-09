import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, spacing } from '../theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export default function TextField({ label, error, required, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={{ color: colors.danger }}> *</Text>}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, error ? { borderColor: colors.danger } : null, style]}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing(4) },
  label: { color: colors.text, fontWeight: '600', marginBottom: spacing(1.5) },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.text,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(3),
    fontSize: 15,
  },
  error: { color: colors.danger, marginTop: spacing(1), fontSize: 13 },
});

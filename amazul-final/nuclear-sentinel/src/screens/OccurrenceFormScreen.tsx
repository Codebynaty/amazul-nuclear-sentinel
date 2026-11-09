import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import AlertBadge from '../components/AlertBadge';
import Button from '../components/Button';
import OptionPicker from '../components/OptionPicker';
import TextField from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { getTypeInfo, OCCURRENCE_TYPES, SECTORS } from '../data/catalog';
import { ScreenProps } from '../navigation/types';
import { classifyOccurrence } from '../services/alertClassifier';
import { createOccurrence } from '../services/occurrenceService';
import { colors, spacing } from '../theme';
import { FormErrors, OccurrenceInput, OccurrenceType, Sector } from '../types';
import { parseNumber, validateOccurrence } from '../utils/validation';

const EMPTY: OccurrenceInput = { titulo: '', descricao: '', setor: '', tipo: '', valorMedido: '' };

export default function OccurrenceFormScreen({ navigation }: ScreenProps<'OccurrenceForm'>) {
  const { session } = useAuth();
  const [form, setForm] = useState<OccurrenceInput>(EMPTY);
  const [errors, setErrors] = useState<FormErrors<OccurrenceInput>>({});
  const [saving, setSaving] = useState(false);

  const typeInfo = form.tipo ? getTypeInfo(form.tipo) : undefined;

  function update<K extends keyof OccurrenceInput>(key: K, value: OccurrenceInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined })); // limpa o erro ao corrigir
  }

  // Prévia da classificação em tempo real
  const preview = useMemo(() => {
    if (!form.tipo) return null;
    const v = parseNumber(form.valorMedido);
    return classifyOccurrence({ tipo: form.tipo, valorMedido: v, titulo: form.titulo, descricao: form.descricao });
  }, [form]);

  async function handleSubmit() {
    const e = validateOccurrence(form);
    setErrors(e);
    if (Object.keys(e).length || !session) {
      Alert.alert('Campos inválidos', 'Corrija os campos destacados em vermelho.');
      return;
    }
    setSaving(true);
    try {
      const occ = await createOccurrence(
        {
          titulo: form.titulo.trim(),
          descricao: form.descricao.trim(),
          setor: form.setor as Sector,
          tipo: form.tipo as OccurrenceType,
          valorMedido: typeInfo?.medivel ? parseNumber(form.valorMedido) : undefined,
        },
        session.user,
      );
      navigation.replace('OccurrenceDetail', { id: occ.id });
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a ocorrência.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TextField label="Título" required value={form.titulo} onChangeText={(v) => update('titulo', v)} error={errors.titulo}
          placeholder="Ex.: Temperatura elevada no trocador" maxLength={80} />
        <TextField label="Descrição" required value={form.descricao} onChangeText={(v) => update('descricao', v)} error={errors.descricao}
          placeholder="Descreva o que foi observado" multiline numberOfLines={4} style={{ minHeight: 100, textAlignVertical: 'top' }} />
        <OptionPicker label="Setor" required options={SECTORS.map((s) => ({ value: s, label: s }))}
          value={form.setor} onChange={(v) => update('setor', v)} error={errors.setor} />
        <OptionPicker label="Tipo de ocorrência" required options={OCCURRENCE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          value={form.tipo} onChange={(v) => update('tipo', v)} error={errors.tipo} />
        {typeInfo?.medivel && (
          <TextField label={`Valor medido (${typeInfo.unidade})`} required value={form.valorMedido}
            onChangeText={(v) => update('valorMedido', v)} error={errors.valorMedido} keyboardType="decimal-pad" placeholder="Ex.: 85,5" />
        )}

        {preview && (
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Classificação prevista</Text>
            <AlertBadge level={preview.nivel} />
            <Text style={styles.previewReason}>{preview.motivo}</Text>
          </View>
        )}

        <Button title="Registrar ocorrência" onPress={handleSubmit} loading={saving} />
        <Text style={styles.required}>* campos obrigatórios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing(4), paddingBottom: spacing(10) },
  preview: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: spacing(4), marginBottom: spacing(4), gap: spacing(2) },
  previewTitle: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  previewReason: { color: colors.text, fontSize: 13 },
  required: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: spacing(3) },
});

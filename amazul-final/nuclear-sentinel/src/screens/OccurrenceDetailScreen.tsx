import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AlertBadge from '../components/AlertBadge';
import Button from '../components/Button';
import OptionPicker from '../components/OptionPicker';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getTypeInfo, STATUS_LABEL } from '../data/catalog';
import { ScreenProps } from '../navigation/types';
import { deleteOccurrence, getOccurrence, updateStatus } from '../services/occurrenceService';
import { ROLE_LABEL } from '../services/permissions';
import { alertColors, colors, spacing } from '../theme';
import { Occurrence, OccurrenceStatus } from '../types';
import { formatDateTime } from '../utils/format';

const STATUSES = (Object.keys(STATUS_LABEL) as OccurrenceStatus[]).map((s) => ({ value: s, label: STATUS_LABEL[s] }));

export default function OccurrenceDetailScreen({ route, navigation }: ScreenProps<'OccurrenceDetail'>) {
  const { hasPermission } = useAuth();
  const [occ, setOcc] = useState<Occurrence | null | undefined>(undefined);

  useFocusEffect(useCallback(() => {
    getOccurrence(route.params.id).then((o) => setOcc(o ?? null));
  }, [route.params.id]));

  if (occ === undefined) return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  if (occ === null) return <View style={styles.center}><Text style={{ color: colors.textMuted }}>Ocorrência não encontrada.</Text></View>;

  const info = getTypeInfo(occ.tipo);

  async function changeStatus(s: OccurrenceStatus) {
    const updated = await updateStatus(occ!.id, s);
    if (updated) setOcc(updated);
  }

  function confirmDelete() {
    Alert.alert('Excluir ocorrência', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await deleteOccurrence(occ!.id); navigation.goBack(); } },
    ]);
  }

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.container}>
      <View style={[styles.hero, { backgroundColor: alertColors[occ.nivelAlerta].bg, borderColor: alertColors[occ.nivelAlerta].fg }]}>
        <View style={styles.row}>
          <AlertBadge level={occ.nivelAlerta} />
          <StatusBadge status={occ.status} />
        </View>
        <Text style={styles.title}>{occ.titulo}</Text>
        <Text style={styles.reason}>{occ.motivoClassificacao}</Text>
      </View>

      <View style={styles.section}>
        <Field label="Descrição" value={occ.descricao} />
        <Field label="Setor" value={occ.setor} />
        <Field label="Tipo" value={info.label} />
        {occ.valorMedido !== undefined && <Field label="Valor medido" value={`${occ.valorMedido} ${info.unidade ?? ''}`} />}
        <Field label="Registrado por" value={`${occ.registradoPor.nome} (${ROLE_LABEL[occ.registradoPor.papel]})`} />
        <Field label="Criado em" value={formatDateTime(occ.criadoEm)} />
        <Field label="Última atualização" value={formatDateTime(occ.atualizadoEm)} />
        <Field label="ID" value={occ.id} />
      </View>

      {hasPermission('ocorrencia:alterar_status') ? (
        <View style={styles.section}>
          <OptionPicker label="Alterar status (supervisor)" options={STATUSES} value={occ.status} onChange={changeStatus} />
          {hasPermission('ocorrencia:excluir') && <Button title="Excluir ocorrência" variant="danger" onPress={confirmDelete} />}
        </View>
      ) : (
        <Text style={styles.note}>Somente supervisores podem alterar o status ou excluir ocorrências.</Text>
      )}
    </ScrollView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: spacing(3) }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  container: { padding: spacing(4), paddingBottom: spacing(10), gap: spacing(4) },
  hero: { borderWidth: 1, borderRadius: 14, padding: spacing(4), gap: spacing(2) },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  reason: { color: colors.text, fontSize: 13, opacity: 0.85 },
  section: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: spacing(4) },
  fieldLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  fieldValue: { color: colors.text, fontSize: 15, marginTop: 2 },
  note: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});

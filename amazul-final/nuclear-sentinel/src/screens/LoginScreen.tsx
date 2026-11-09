import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../data/users';
import { ROLE_LABEL } from '../services/permissions';
import { colors, spacing } from '../theme';
import { validateLogin } from '../utils/validation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setAuthError('');
    const e = validateLogin(email, senha);
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await signIn(email, senha);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Falha ao entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>☢</Text>
          <Text style={styles.title}>Nuclear Sentinel</Text>
          <Text style={styles.subtitle}>AMAZUL · Monitoramento de ocorrências</Text>

          <View style={styles.card}>
            <TextField label="E-mail" required value={email} onChangeText={setEmail} error={errors.email}
              autoCapitalize="none" keyboardType="email-address" placeholder="seu@amazul.com" />
            <TextField label="Senha" required value={senha} onChangeText={setSenha} error={errors.senha}
              secureTextEntry placeholder="••••••" onSubmitEditing={handleLogin} />
            {!!authError && <Text style={styles.authError}>{authError}</Text>}
            <Button title="Entrar" onPress={handleLogin} loading={loading} />
          </View>

          <Text style={styles.hint}>Contas de teste (toque para preencher):</Text>
          {MOCK_USERS.map((u) => (
            <Pressable key={u.id} style={styles.demo} onPress={() => { setEmail(u.email); setSenha(u.senha); setErrors({}); setAuthError(''); }}>
              <Text style={styles.demoRole}>{ROLE_LABEL[u.papel]}</Text>
              <Text style={styles.demoCred}>{u.email} / {u.senha}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing(6), flexGrow: 1, justifyContent: 'center' },
  logo: { fontSize: 56, textAlign: 'center', color: colors.warning },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.textMuted, textAlign: 'center', marginBottom: spacing(8) },
  card: { backgroundColor: colors.surface, padding: spacing(5), borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  authError: { color: colors.danger, marginBottom: spacing(3), textAlign: 'center', fontWeight: '600' },
  hint: { color: colors.textMuted, marginTop: spacing(6), marginBottom: spacing(2) },
  demo: { backgroundColor: colors.surfaceAlt, borderRadius: 10, padding: spacing(3), marginBottom: spacing(2) },
  demoRole: { color: colors.text, fontWeight: '700' },
  demoCred: { color: colors.textMuted, fontSize: 13 },
});

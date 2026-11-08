import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import OccurrenceListScreen from '../screens/OccurrenceListScreen';
import OccurrenceFormScreen from '../screens/OccurrenceFormScreen';
import OccurrenceDetailScreen from '../screens/OccurrenceDetailScreen';
import { colors } from '../theme';
import { AppStackParamList, AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.surface, text: colors.text, border: colors.border, primary: colors.primary },
};

export default function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {session ? (
        <AppStack.Navigator screenOptions={{ headerTintColor: colors.text }}>
          <AppStack.Screen name="OccurrenceList" component={OccurrenceListScreen} options={{ title: 'Ocorrências' }} />
          <AppStack.Screen name="OccurrenceForm" component={OccurrenceFormScreen} options={{ title: 'Nova ocorrência' }} />
          <AppStack.Screen name="OccurrenceDetail" component={OccurrenceDetailScreen} options={{ title: 'Detalhes' }} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

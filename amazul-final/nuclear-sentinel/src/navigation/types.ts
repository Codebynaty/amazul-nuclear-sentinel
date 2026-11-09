import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  OccurrenceList: undefined;
  OccurrenceForm: undefined;
  OccurrenceDetail: { id: string };
};

export type ScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

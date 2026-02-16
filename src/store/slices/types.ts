import type { IAlertColor } from '@/shared/ui/feedback/GlobalSnackbar';
import type { UserProfile } from '@/modules/auth/model/types';

export interface AppState {
  isLoading: boolean;
  message: string;
  messageType: IAlertColor;
  currentPath: string;
}

export interface AuthState {
  profile: UserProfile | null;
  accessToken: string;
}

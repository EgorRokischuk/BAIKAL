import type { RootState } from '../index';

export const selectAuth = (state: RootState) => state.auth;
export const selectProfile = (state: RootState) => state.auth.profile;
export const selectUserRights = (state: RootState) => state.auth.profile?.userRights ?? [];
export const selectAccessToken = (state: RootState) => state.auth.accessToken;

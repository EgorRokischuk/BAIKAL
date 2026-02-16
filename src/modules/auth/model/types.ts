export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

export interface RegisterPayload extends LoginPayload {
  fullname: string;
  email: string;
  phoneNumber: string;
  passwordAgain: string;
}

export interface RegisterDto {
  fio: string;
  password: string;
  login: string;
  mail: string;
  phone_number: string;
}

export interface UserProfileDto {
  fio: string;
  login: string;
  mail: string;
  phone_number: string;
  date_created: string;
  roles: string[];
  locked: boolean;
}

export interface UserProfile {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  userRights: string[];
}

export interface ProfileUpdatePayload {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  password?: string;
}

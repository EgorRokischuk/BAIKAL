import type {
  LoginDto,
  LoginPayload,
  RegisterDto,
  RegisterPayload,
  UserProfile,
  UserProfileDto,
} from './types';

export const mapLoginPayload = (payload: LoginPayload): LoginDto => ({
  username: payload.login,
  password: payload.password,
});

export const mapRegisterPayload = (payload: RegisterPayload): RegisterDto => ({
  fio: payload.fullname,
  password: payload.password,
  login: payload.login,
  mail: payload.email,
  phone_number: payload.phoneNumber.replace(/\D/g, ''),
});

export const mapUserProfile = (dto: UserProfileDto): UserProfile => ({
  fullname: dto.fio,
  username: dto.login,
  email: dto.mail,
  phoneNumber: dto.phone_number,
  userRights: dto.roles,
});

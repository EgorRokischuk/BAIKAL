export type TRole = 'admin' | 'user';

export interface IRole {
	id: string;
	name: TRole;
}

export interface IUser {
	id: string;
	fullname: string;
	email: string;
	workplace: string;
	avatarUrl: string;
	userRights: Array<IRole>;
}

export interface ILogin {
	login: string;
	password: string;
}

export interface ILoginResponse {
	access_token: string;
	refresh_token: string;
	token_type: 'bearer';
}

export interface IRegister extends ILogin {
	fullname: string;
	email: string;
	phoneNumber: string;
	passwordAgain: string;
}

export interface IProfileResponse {
	user: IUser;
}

export interface IExtraArgument {
	navigate: (path: string) => void;
}

export interface IUserState {
	fullProfile: IUser | null;
}

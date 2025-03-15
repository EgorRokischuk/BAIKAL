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
	accessToken: string;
	user: IUser;
}

export interface IRegister extends ILogin {
	fullname: string;
	email: string;
	workplace: string;
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

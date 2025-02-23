export interface IRole {
	id: string;
	name: 'admin' | 'user';
}

export interface IUser {
	id: string;
	fullname: string;
	email: string;
	workplace: string;
	userRights: Array<IRole>;
}

export interface ILogin {
	login: string;
	password: string;
}

export interface IRegister extends ILogin {
	fullname: string;
	email: string;
	workplace: string;
	passwordAgain: string;
}

export interface ILoginResponse {
	accessToken: string;
	userData: IUser;
}

export interface IProfileResponse {
	user: IUser;
	requestsHistory: unknown; // TODO
}

export interface IExtraArgument {
	navigate: (path: string) => void;
}

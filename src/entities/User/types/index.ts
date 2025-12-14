export interface IUser {
        fullname: string;
        username: string;
        email: string;
        phoneNumber: string;
        userRights: Array<string>;
}

export interface IUserWithId extends IUser {
        id: number;
        locked: boolean;
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

export interface IExtraArgument {
	navigate: (path: string) => void;
}

export interface IUserState {
	fullProfile: IUser | null;
}

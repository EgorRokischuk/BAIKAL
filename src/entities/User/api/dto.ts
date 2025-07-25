import { ILogin, IRegister } from '../types';

export interface IRegisterDTO {
	fio: string;
	password: string;
	login: string;
	mail: string;
	phone_number: string;
}

export const adaptRegister = (register: IRegister): IRegisterDTO => ({
	fio: register.fullname,
	password: register.password,
	login: register.login,
	mail: register.email,
	phone_number: register.phoneNumber,
});

export interface ILoginDTO {
	grant_type: string;
	username: string;
	password: string;
}

export const adaptLogin = (login: ILogin): ILoginDTO => ({
	grant_type: 'password',
	username: login.login,
	password: login.password,
});

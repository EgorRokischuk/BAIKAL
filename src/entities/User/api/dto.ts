import { ILogin, IRegister, IUser, IUserHistoryRecord, IUserProfileUpdate } from '../types';

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

export interface IProfileDTO {
        fio: string;
        login: string;
        mail: string;
        phone_number: string;
        date_created: string;
        roles: Array<string>;
        locked: boolean;
}

export const adaptProfile = (profile: IProfileDTO): IUser => ({
        fullname: profile.fio,
        username: profile.login,
        email: profile.mail,
        phoneNumber: profile.phone_number,
        userRights: profile.roles,
        registeredAt: profile.date_created,
});

export interface IProfileUpdateDTO {
        fio: string;
        login: string;
        mail: string;
        phone_number: string;
}

export const adaptProfileUpdate = (profile: IUserProfileUpdate): IProfileUpdateDTO => ({
        fio: profile.fullname,
        login: profile.username,
        mail: profile.email,
        phone_number: profile.phoneNumber,
});

export interface IUserHistoryRecordDTO {
        date: string;
        email: string;
        product: string;
        comment?: string;
}

export const adaptHistoryRecord = (record: IUserHistoryRecordDTO): IUserHistoryRecord => ({
        date: record.date,
        email: record.email,
        product: record.product,
        comment: record.comment,
});

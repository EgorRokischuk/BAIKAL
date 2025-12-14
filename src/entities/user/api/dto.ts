import { ILogin, IRegister, IUser, IUserByLogin } from '../types';

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
});

export interface IUserByLoginDTO {
        id: number;
        fio: string;
        login: string;
        mail: string;
        phone_number: string;
        roles?: Array<string>;
        locked?: boolean;
}

export const adaptUserByLogin = (user: IUserByLoginDTO): IUserByLogin => ({
        id: user.id,
        fullname: user.fio,
        username: user.login,
        email: user.mail,
        phoneNumber: user.phone_number,
        userRights: user.roles ?? [],
});

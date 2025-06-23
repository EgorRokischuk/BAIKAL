import { IPublicationRequest, IPublicationResponse } from '../types';

export interface IPublicationDTO {
	id?: number;
	title: string;
	description: string;
	authors: string;
	url_path: string;
}

export const adaptPublicationDTO = (dto: IPublicationDTO): IPublicationResponse => ({
	id: dto.id,
	title: dto.title,
	description: dto.description,
	authors: dto.authors,
	url: dto.url_path,
});

export const adaptPublicationDTOList = (
	dtos: Array<IPublicationDTO>,
): Array<IPublicationResponse> => dtos.map(adaptPublicationDTO);

export const adaptPublication = (dto: IPublicationRequest): IPublicationDTO => ({
	title: dto.title,
	description: dto.description,
	authors: dto.authors,
	url_path: dto.url,
});

export const adaptPublicationList = (dtos: Array<IPublicationDTO>): Array<IPublicationResponse> =>
	dtos.map(adaptPublicationDTO);

import type { Publication, PublicationDto, PublicationPayload } from './types';

export const mapPublicationDto = (dto: PublicationDto): Publication => ({
  id: dto.id ?? 0,
  title: dto.title,
  description: dto.description ?? '',
  authors: dto.authors ?? '',
  url: dto.url_path ?? dto.url_server ?? '',
});

export const mapPublicationPayload = (payload: PublicationPayload): PublicationDto => ({
  title: payload.title,
  description: payload.description,
  authors: payload.authors,
  url_path: payload.url,
});

export interface Publication {
  id: number;
  title: string;
  description: string;
  authors: string;
  url: string;
}

export interface PublicationDto {
  id?: number;
  title: string;
  description?: string | null;
  authors?: string | null;
  url_path?: string | null;
  url_server?: string | null;
}

export interface PublicationPayload {
  title: string;
  description: string;
  authors: string;
  url: string;
}

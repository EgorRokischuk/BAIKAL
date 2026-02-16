export interface ExternalResource {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
}

export interface ExternalResourcePayload {
  title: string;
  link: string;
  image?: File;
}

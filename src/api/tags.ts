export const ApiTag = {
  Profile: 'Profile',
  Publication: 'Publication',
  AboutRecord: 'AboutRecord',
  ExternalResource: 'ExternalResource',
} as const;

export type ApiTag = (typeof ApiTag)[keyof typeof ApiTag];

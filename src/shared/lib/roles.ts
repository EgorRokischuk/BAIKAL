import { AppRole } from '@/shared/constants/roles';

export const hasAdminRights = (rights: string[] | null | undefined): boolean => {
  if (!rights?.length) {
    return false;
  }

  return rights.some((role) => {
    const normalized = role.trim().toLowerCase();
    return normalized === AppRole.ADMIN.toLowerCase() || normalized.includes('admin') || normalized.includes('админ');
  });
};

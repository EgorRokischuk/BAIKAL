import { ExpandMore } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileQuery } from '@/modules/auth/authApi';
import { ROUTES } from '@/shared/constants/routes';
import { hasAdminRights } from '@/shared/lib/roles';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import { removeFromStorage } from '@/shared/lib/storage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authActions } from '@/store/slices/authSlice';
import { selectProfile } from '@/store/slices/authSelectors';

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);

  useProfileQuery();

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const open = Boolean(anchor);

  const handleLogout = () => {
    removeFromStorage(STORAGE_KEYS.accessToken);
    removeFromStorage(STORAGE_KEYS.refreshToken);
    dispatch(authActions.logout());
    navigate(ROUTES.home);
    setAnchor(null);
  };

  const fullName = profile?.fullname || 'Гость';
  const shortName = profile?.fullname
    ? `${profile.fullname.split(' ')[0]} ${profile.fullname.split(' ')[1]?.[0] || ''}.`
    : 'Гость';
  const canOpenAdminPanel = hasAdminRights(profile?.userRights);

  return (
    <>
      <Button
        color="inherit"
        variant="outlined"
        size="small"
        sx={{
          minHeight: 36,
          px: 1.1,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'center' },
          maxWidth: '100%',
        }}
        onClick={(event) => setAnchor(event.currentTarget)}
        endIcon={<ExpandMore />}
      >
        <Stack direction="row" spacing={0.9} alignItems="center">
          <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>{fullName[0]}</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 700, maxWidth: 154, fontSize: '0.82rem' }} noWrap>
            {shortName}
          </Typography>
        </Stack>
      </Button>

      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <Box sx={{ px: 2, py: 1.5, minWidth: 280 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile?.email ?? 'Режим гостя'}
          </Typography>
        </Box>
        <Divider />

        {profile ? (
          <>
            <MenuItem
              onClick={() => {
                navigate(ROUTES.profile);
                setAnchor(null);
              }}
            >
              Личный кабинет
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(ROUTES.downloadHistory);
                setAnchor(null);
              }}
            >
              История скачиваний
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(ROUTES.statistics);
                setAnchor(null);
              }}
            >
              Статистика
            </MenuItem>
            {canOpenAdminPanel && (
              <MenuItem
                onClick={() => {
                  navigate(ROUTES.adminPanel);
                  setAnchor(null);
                }}
              >
                Админ-панель
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                navigate(ROUTES.support);
                setAnchor(null);
              }}
            >
              Поддержка
            </MenuItem>
            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              onClick={() => {
                navigate(ROUTES.auth.login);
                setAnchor(null);
              }}
            >
              Войти
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(ROUTES.auth.register);
                setAnchor(null);
              }}
            >
              Регистрация
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

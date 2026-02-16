import { Box, Skeleton, Stack } from '@mui/material';

export const RouteSkeleton = () => {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Skeleton variant="rounded" height={56} />
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
        <Skeleton variant="rounded" sx={{ flex: 1 }} height={520} />
        <Skeleton variant="rounded" sx={{ width: { xs: '100%', lg: 320 } }} height={520} />
      </Stack>
    </Box>
  );
};

import type { PropsWithChildren } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

interface EntityDialogProps extends PropsWithChildren {
  open: boolean;
  title: string;
  width?: number;
  onCancel: () => void;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
}

export const EntityDialog = ({
  open,
  title,
  width = 560,
  onCancel,
  onSubmit,
  submitText = 'Save',
  cancelText = 'Cancel',
  children,
}: EntityDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm" PaperProps={{ sx: { width } }}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
        }}
      >
        {title}
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="entity-form" onSubmit={onSubmit}>
          <Stack spacing={2}>{children}</Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button type="submit" form="entity-form" variant="contained">
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import { createRoot } from 'react-dom/client';
import { router } from './app/providers/routers';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './app/providers/store';
import { theme } from '@/shared/ui/themes/theme';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const root = document.getElementById('root');

if (!root) throw new Error('Root element not found');

const container = createRoot(root);
container.render(
	<StoreProvider>
		<ThemeProvider theme={theme}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<RouterProvider router={router} />
			</LocalizationProvider>
		</ThemeProvider>
	</StoreProvider>,
);

import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { theme } from '@/app/themes/theme';
import { router } from './app/providers/routers';
import { StoreProvider } from './app/providers/store';

const root = document.getElementById('root');

if (!root) throw new Error('Root element not found');

async function enableMocking() {
	if (__IS_DEV__) {
		return;
	}

	const { worker } = await import('@/app/msw/browser');

	return worker.start({
		onUnhandledRequest: 'bypass',
	});
}

enableMocking().then(() =>
	createRoot(root).render(
		<StoreProvider>
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<RouterProvider router={router} />
				</LocalizationProvider>
			</ThemeProvider>
		</StoreProvider>,
	),
);

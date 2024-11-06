import { createRoot } from 'react-dom/client';
import { router } from './app/providers/routers';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './app/providers/store';

const root = document.getElementById('root');

if (!root) throw new Error('Root element not found');

const container = createRoot(root);
container.render(
	<StoreProvider>
		<RouterProvider router={router} />
	</StoreProvider>,
);

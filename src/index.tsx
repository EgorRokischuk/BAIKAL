import { createRoot } from 'react-dom/client';
import { App } from './app';
import { StoreProvider } from './app/providers/store';

const root = document.getElementById('root');

if (!root) throw new Error('Root element not found');

const container = createRoot(root);
container.render(
	<StoreProvider>
		<App />
	</StoreProvider>,
);

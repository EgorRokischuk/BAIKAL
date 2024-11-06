import { Header } from '@/widgets/header';
import { AppRouter } from './providers/routers';

import './styles/normalize.scss';

function App() {
	return (
		<>
			<Header />
			<AppRouter />
		</>
	);
}

export { App };

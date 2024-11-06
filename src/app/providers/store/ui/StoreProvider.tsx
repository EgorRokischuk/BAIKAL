import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { createReduxStore } from '../config';

const StoreProvider = ({ children }: PropsWithChildren) => {
	const store = createReduxStore();

	return <Provider store={store}>{children}</Provider>;
};

export { StoreProvider };

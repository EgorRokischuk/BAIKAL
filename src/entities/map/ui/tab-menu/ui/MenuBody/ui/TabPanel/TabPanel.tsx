import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

interface IProps {
	value: number;
	index: number;
}

const TabPanel = ({ children, value, index, ...props }: PropsWithChildren<IProps>) => {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...props}
		>
			{value === index && <Box sx={{ p: 0 }}>{children}</Box>}
		</div>
	);
};

export { TabPanel };

import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase, Paper } from '@mui/material';
import { useState } from 'react';

interface ISearchPublicationProps {
	onClick: (searchText?: string) => void;
}

export const SearchPublication: React.FC<ISearchPublicationProps> = (props) => {
	const [value, setValue] = useState<string>('');

	const onSearchClick = async () => {
		props.onClick(value);
	};

	return (
		<Paper
			component="form"
			sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
		>
			<InputBase
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				sx={{ ml: 1, flex: 1 }}
				placeholder="Поиск по публикациям"
				inputProps={{ 'aria-label': 'Поиск по публикациям' }}
			/>
			<IconButton onClick={onSearchClick} type="button" sx={{ p: '10px' }} aria-label="search">
				<SearchIcon />
			</IconButton>
		</Paper>
	);
};

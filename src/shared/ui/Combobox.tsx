// import { Chip, FormControl, Input } from '@mui/material';
// import React, { useState } from 'react';

// interface IComboboxProps {
// 	value: Array<string>;
// }

// export const Combobox: React.FC<IComboboxProps> = ({ value }) => {
// 	const [values, setValues] = useState<Array<string>>(value);
// 	const [currValue, setCurrValue] = useState<string>('');

// 	const handleKeyUp = (e) => {
// 		if (e.keyCode == 188) {
// 			setValues((oldState) => [...oldState, e.target.value]);
// 			setCurrValue('');
// 		}

// 		if (e.keyCode == 8 && currValue === '') {
// 			setValues((oldState) => [...oldState.slice(0, -1)]);
// 		}
// 	};

// 	const handleChange = (e) => {
// 		setCurrValue(e.target.value);
// 	};

// 	const handleDelete = (index: number) => {
// 		const arr = [...values];
// 		arr.splice(index, 1);
// 		setValues(arr);
// 	};

// 	return (
// 		<FormControl>
// 			<div className={'container'}>
// 				{values.map((item, index) => (
// 					<Chip key={index} size="small" onDelete={() => handleDelete(index)} label={item} />
// 				))}
// 			</div>
// 			<Input value={currValue} onChange={handleChange} onKeyDown={handleKeyUp} />
// 		</FormControl>
// 	);
// };

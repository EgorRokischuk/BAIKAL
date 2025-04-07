type TDictinary = {
	[key: string]: string;
};

export const typeDictionary: TDictinary = {
	baikalRiver: 'Озеро Байкал',
	baikalNature: 'Байкальская природная территория',
	groundData: 'Наземные данные',
};

export const parameterDictionary: TDictinary = {
	temperature: 'LST',
	chlorophyll: 'Хлорофилл',
	transparency: 'Прозрачность',
};

export const deviceDictionary: TDictinary = {
	viirs: 'VIIRS',
	terra: 'MODIS Terra',
	aqua: 'MODIS Aqua',
	landsat: 'LANDSAT',
};

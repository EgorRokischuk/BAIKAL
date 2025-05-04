import { IExternalResourceResponse } from '@/entities/ExternalResource/types';
import { IPaginationResponse } from '@/shared/types';

export default {
	page: 1,
	total: 10,
	data: [
		{
			id: '7d630d53-7a07-479e-9e15-1a5019e76122',
			title: 'Цифровой мониторинг Байкальской природной территории',
			link: 'https://baikal-project.icc.ru/',
			imageUrl: 'https://baikal-project.icc.ru/wp-content/themes/idstu/assets/img/index/space.png',
		},
		{
			id: '1ded102e-22dd-4f14-8f91-2dea869f3c21',
			title: 'Заповедное Прибайкалье',
			link: 'https://baikal-1.ru/',
			imageUrl: 'https://baikal-project.icc.ru/wp-content/uploads/2022/03/forest.png',
		},
		{
			id: '3b5b4ae7-b0eb-45a8-8038-f64a96c591ad',
			title: 'Экологический мониторинг озера Байкал',
			link: 'https://www.baikalake.ru/',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
		},
		{
			id: '43e270e7-f79d-4f41-a7b1-881784d9616b',
			title: 'Фонд содействия сохранения озера Байкал',
			link: 'https://baikalfund.ru/baikal/index.wbp',
			imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/09/32/adult-1868750_1280.jpg',
		},
		{
			id: 'edf40b70-0989-466b-a48c-2084675faf45',
			title: 'Охрана озера Байкал',
			link: 'http://geol.irk.ru/baikal/',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/03/26/09/54/abstract-690112_1280.jpg',
		},
		{
			id: '2f3b02dc-fc81-45f2-9873-eb91767da426',
			title: 'Байкальский государственный природный заповедник',
			link: 'https://baikalzapovednik.ru/',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/03/26/09/41/balloon-690129_1280.jpg',
		},
		{
			id: 'c7a85de6-9ef3-4748-ad89-ca6235cdd3f9',
			title: 'Первый байкальский',
			link: 'https://1baikal.ru/',
			imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/03/53/animal-1867127_1280.jpg',
		},
		{
			id: 'e7966a9f-76ff-47a4-ab17-291596df0588',
			title: 'Открой Байкал ',
			link: 'http://discoverbaikal.ru/',
			imageUrl: 'https://cdn.pixabay.com/photo/2015/09/18/20/20/africa-950920_1280.jpg',
		},
		{
			id: 'a0300f78-9400-44a2-9fd8-81ea61e0f380',
			title: 'Байкал.ру',
			link: 'http://baikal.ru/ru',
			imageUrl: 'https://cdn.pixabay.com/photo/2016/11/18/14/50/box-1837418_1280.jpg',
		},
		{
			id: '9ceefce3-78d2-457a-810f-612dcdbefeca',
			title: 'Природа Байкала. Авторский проект Вячеслава Петухина ',
			link: 'https://nature.baikal.ru/',
			imageUrl: 'https://baikal-project.icc.ru/wp-content/uploads/2022/03/earth-shake.png',
		},
	],
} satisfies IPaginationResponse<IExternalResourceResponse>;

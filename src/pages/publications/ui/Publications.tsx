// import { PublicationFeed } from '@/widgets/publication-feed';
// import { CreateEntity } from '@/features/create-entity';
// import { SearchPublication } from '@/features/Publication/search-publication';
// import { EAppRole } from '@/shared/types';
// import { useEffect } from 'react';
// import { useLazyGetPublicationsListQuery } from '@/entities/Publication';
// import { getUserRights } from '@/entities/User';
// import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Box } from '@mui/material';
import * as s from './Publications.module.scss';

const Publications: React.FC = () => {
	// const userRights = useAppSelector(getUserRights);
	// const [trigger, { data = [], isFetching }] = useLazyGetPublicationsListQuery();

	// useEffect(() => {
	// 	trigger();
	// }, [trigger]);

	return (
		<Box className={s.page}>
			{/* Левая колонка — статический список */}
			<Box className={s.page__content}>
				<header className={s.page__header}>
					<h1 className={s.title}>Публикации</h1>
					<p className={s.subtitle}>
						Подборка публикаций, посвящённых климату и состоянию озера Байкал.
					</p>
				</header>

				<section className={s.section}>
					<ol className={s.sectionList}>
						<li>
							Россолимо Л.Л. Температурный режим озера Байкал // Труды Байкальской лимнологической
							станции ВСФ АН СССР. – 1957. – Т. 16. – 552 с.
						</li>
						<li>
							Троицкая Е.С., Шимараев М.Н., Цехановский В.В. Многолетние изменения температуры
							поверхности воды в Байкале // География и природ. ресурсы. – 2003. – №. 2. – С. 47-50.
						</li>
						<li>
							Moore M.V., Hampton S.E., Izmest&apos;eva L.R. et al. Climate change and the
							world&apos;s “sacred sea” – Lake Baikal, Siberia // BioScience. – 2009. – Vol. 59. –
							N. 5. – P. 405-417. – DOI:10.1525/bio.2009.59.5.8.
						</li>
						<li>
							Shimaraev M.N., Kuimova L.N., Sinyukovich V.N. et al. Manifestation of global climatic
							changes in Lake Baikal during the 20th century // Doklady Earth Sciences. – 2002. –
							Vol. 383. – N. 3. – P. 288-291.
						</li>
						<li>
							Mogilev N.Y., Gnatovskiy R.Y. Satellite imagery in the study of Lake Baykal surface
							temperatures // Mapping Sciences and Remote Sensing. – 2003. – Vol. 40. – N. 1. – P.
							41-50. – DOI:10.2747/0749-3878.40.1.41.
						</li>
						<li>
							Sobrino J.A., García-Monteiro S., Julien Y. An analysis of the lake surface water
							temperature evolution of the world’s largest lakes during the years 2003-2020 using
							MODIS data // Recent Advances in Remote Sensing. – 2024. – Vol. 1. – P. 1-9. –
							DOI:10.62880/rars240001.
						</li>
						<li>
							Сутырина Е.Н. Изучение внутренних водоёмов и водосборов с применением данных
							дистанционного зондирования Земли. – Иркутск: Изд-во ИГУ, 2014. – 133 с.
						</li>
						<li>
							Bolgrien D.W., Granin N.G., Levin L. Surface temperature dynamics of Lake Baikal
							observed from AVHRR images // Photogrammetric Engineering & Remote Sensing. – 1995. –
							Vol. 61. – N. 2. – P. 111-116.
						</li>
						<li>
							Ananina T.L., Ananin A.A. Long-term climatic changes in the northeastern Baikal Region
							(Russia) // Journal of Atmospheric Science Research. – 2020. – Vol. 3. – N. 4. – P.
							10-15. – DOI:10.30564/jasr.v3i4.2255.
						</li>
						<li>
							Hampton S.E., Izmest&apos;eva L.R., Moore M.V. et al. Sixty years of environmental
							change in the world&apos;s largest freshwater lake – Lake Baikal, Siberia // Global
							Change Biology. – 2008. – Vol. 14. – N. 8. – P. 1947-1958. –
							DOI:10.1111/j.1365-2486.2008.01616.x.
						</li>
						<li>
							Асламов И.А., Гнатовский Р.Ю., Макаров М.М. и др. Климатические изменения и
							термобарическая неустойчивость верхнего слоя гиполимниона озера Байкал при летней
							стратификации // Озера Евразии: проблемы и пути их решения. Материалы III
							международной конференции (г. Казань, 20-23 мая 2025 г.). – Казань: Издательство
							Академии наук РТ, 2025. – С. 247-252.
						</li>
						<li>
							Болданова Е.В. Оценка трофности озера Байкал с использованием дистанционного
							зондирования // Географический вестник. – 2022. – № 2(61). – С. 73-89.
						</li>
						<li>
							Shimaraev, M.N., Troitskaya, E.S. Current trends in upper water layer temperature in
							coastal zones of Baikal // Geography and Natural Resources. – 2018. – Vol. 39. – P.
							349-357. – DOI:10.1134/S187537281804008X.
						</li>
						<li>
							Семовский С.В. Водные экосистемы: от космических наблюдений к математическому
							моделированию. – Иркутск: Издательство Института географии СО РАН, 1999. – 200 с.
						</li>
						<li>
							Heim B., Magnussen S., Oberhänsli H., Kaufmann H. Case 2 Lake Baikal: analyses of
							SeaWiFS data within the scope of the paleoclimate project CONTINENT // EARSeL
							eProceedings. – 2004. – Vol. 3. – P. 127-135.
						</li>
						<li>
							Heim B., Oberhänsli H., Fietz S., Kaufmann H. Variation in Lake Baikal&apos;s
							phytoplankton distribution and fluvial input assessed by SeaWiFS satellite data //
							Global and Planetary Change. – 2005. – Vol. 46. – Is. 1-4. – P. 9-27. –
							DOI:10.1016/j.gloplacha.2004.11.011.
						</li>
						<li>
							Heim B. Qualitative and quantitative analyses of Lake Baikal’s surface-waters using
							ocean colour satellite data (SeaWiFS) // Dissertation zur Erlangung des akademischen
							Grades «doctor rerum naturalium» (Dr. rer. nat.) in der Wissenschaftsdisziplin
							«Geowissenschaftliche Fernerkundung» (Potsdam, den 27.06.2005).
						</li>
						<li>
							Сутырина Е.Н. Использование данных дистанционного спутникового зондирования для
							картографического отображения и анализа распределения температуры поверхности воды
							озера Байкал // Известия Иркутского государственного университета. Серия: Науки о
							Земле. – 2012. – Т. 5. – № 2. – С. 240-251.
						</li>
						<li>
							Сутырина Е.Н. Применение интерполяции для заполнения пробелов в рядах спутниковых
							наблюдений за температурным режимом озера Байкал // Региональные проблемы
							дистанционного зондирования Земли: Материалы VII Международной научной конференции. –
							СФУ, ИКИТ, 2020. – С. 293-296.
						</li>
						<li>
							Sodnomov B.V., Tsydypov B.Z., Garmayev E.Z. Determination of the chlorophyll “a”
							concentration in Lake Baikal using remote sensing methods / Proceedings of the
							International Conference and EarlyCareer Scientists School on Environmental
							Observations, Modeling and Information System. – Tomsk, Russia, 11-16 July 2016.
						</li>
						<li>
							Мамаш Е.А., Пестунов И.А., Федоров Р.К. Оценка среднемесячных значений температуры
							поверхностного слоя акватории озера Байкал по спутниковым данным различного
							пространственного разрешения // Интерэкспо Гео-Сибирь. – 2024. – Т. 4. – № 1. – С.
							86-93.
						</li>
						<li>
							Мамаш E.A., Пестунов И.А., Чурилова Т.Я., Федоров Р.К. Оценка пространственного
							распределения концентрации хлорофилла «а» в поверхностном слое акватории оз. Байкал на
							основе данных спектрорадиометра MODIS/(Terra+Aqua) // Материалы 22-й Международной
							конференции «Современные проблемы дистанционного зондирования Земли из космоса». –
							Москва. – 2024. – С. 348. – DOI:10.21046/22DZZconf-2024a.
						</li>
						<li>
							Мамаш Е.А., Пестунов И.А., Блинов В.В., Мазяр А.Н., Асламов И.А. Тренды температуры
							поверхности озера Байкал: многолетний анализ на основе валидированных спутниковых
							продуктов // Современные проблемы дистанционного зондирования Земли из космоса. –
							2025. – Т. 22. – № 5. – С. 306-321. – DOI:10.21046/2070-7401-2025-22-5-306-321.
						</li>
						<li>
							Пестунов И.А., Мамаш Е.А., Жирнов А.А., Дубровская О.А., Бельский А.С., Синявский
							Ю.Н., Шабальников И.В., Иргит А.А., Мазяр А.Н. Спутниковый мониторинг поверхностного
							слоя озера Байкал: оценка ключевых параметров и анализ трендов // Сборник трудов X
							Всероссийской конференции с международным участием «Обработка пространственных данных
							в задачах мониторинга природных и антропогенных процессов, посвященная памяти
							академика Ю.И. Шокина» (26-29 августа 2025 г., г. Белокуриха). – Новосибирск: ФИЦ ИВТ,
							2025. – С. 18-23. – DOI:10.25743/SDMB.2025.37.25.024.
						</li>
					</ol>
				</section>
			</Box>

			{/* Правая колонка — поиск и список публикаций из БД */}
			{/* <Box className={s.page__sidebar}>
				<Box className={s.page__gallery}>
					<Box className={s.page__galleryHeader}>
						<b>Пока что эта секция находятся в разработке, но скоро всё заработает</b>
						<h2 className={s.sectionTitle}>База публикаций</h2>
						<p className={s.text}>
							Используйте поиск, чтобы найти публикации в системе.
						</p>
					</Box>

					<Box className={s.page__gallerySearch}>
						<SearchPublication onClick={trigger} />
					</Box>

					<Box className={s.page__galleryContent}>
						<PublicationFeed data={data} isLoading={isFetching} />
					</Box>
				</Box>

				{userRights.some((role) => role === EAppRole.ADMIN) && (
					<Box className={s.page__adminControls}>
						<h3 className={s.sectionSubtitle}>Добавить публикацию</h3>
						<CreateEntity type="publication" />
					</Box>
				)}
			</Box> */}
		</Box>
	);
};

export { Publications };

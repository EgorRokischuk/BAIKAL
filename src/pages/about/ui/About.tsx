// import { AboutRecordFeed } from '@/widgets/about-record-feed';
// import { CreateEntity } from '@/features/create-entity';
// import { getUserRights } from '@/entities/User';
// import { useAppSelector } from '@/shared/hooks/useAppSelector';
// import { EAppRole } from '@/shared/types';
import { Box } from '@mui/material';
import * as s from './About.module.scss';

const About: React.FC = () => {
	// const userRights = useAppSelector(getUserRights);

	// console.log(userRights);

	return (
		<Box className={s.page}>
			<Box className={s.page__content}>
				<header className={s.page__header}>
					<h1 className={s.title}>О проекте</h1>
					<p className={s.subtitle}>Информационная система мониторинга состояния озера Байкал.</p>
				</header>

				<section className={s.section}>
					<p className={s.text}>
						Информационная система «Байкал» (
						<a
							className={s.link}
							href="https://baikal.ict.nsc.ru"
							target="_blank"
							rel="noopener noreferrer"
						>
							https://baikal.ict.nsc.ru
						</a>
						) предоставляет инструменты для визуализации и работы со спутниковыми и наземными
						данными наблюдений акватории озера Байкал за период с 2000 года по настоящее время, с
						возможностью загрузки продуктов в формате GeoTIFF.
					</p>

					<p className={s.text}>
						Система позволяет работать как с архивными данными, так и формировать продукты
						оперативно по запросу. Её функционал включает:
					</p>

					<ul className={s.list}>
						<li>
							Набор тематических карт озера Байкал, построенных по спутниковым данным разного
							пространственного разрешения.
						</li>
						<li>
							Инструментарий для онлайн-генерации спутниковых продуктов в границах пользовательских
							полигонов.
						</li>
					</ul>
				</section>

				<section className={s.section}>
					<h2 className={s.sectionTitle}>Доступные данные</h2>

					<ol className={s.sectionList}>
						<li className={s.sectionItem}>
							<h3 className={s.sectionSubtitle}>
								Спутниковые продукты (доступны за период с 2002 по 2024 гг.):
							</h3>
							<ul className={s.list}>
								<li>
									Температура поверхностного слоя воды (по данным спутников VIIRS/NPP, MODIS/Terra,
									MODIS/Aqua, Landsat-8) – в виде дневных, ночных, среднесуточных и многолетних
									среднемесячных значений.
								</li>
								<li>Оценка содержания хлорофилла-а в поверхностном слое воды.</li>
								<li>Отдельные снимки со спутника Landsat-8 за конкретные даты.</li>
							</ul>
						</li>

						<li className={s.sectionItem}>
							<h3 className={s.sectionSubtitle}>
								Наземные данные (доступны за период с 2018 по 2024 гг.):
							</h3>
							<ul className={s.list}>
								<li>Показания датчиков с метеостанций и судовых измерений.</li>
								<li>
									Параметры: поверхностная температура, хлорофилл-а, атмосферное давление,
									прозрачность воды, скорость ветра, влажность и др. — с привязкой к координатам и
									времени.
								</li>
							</ul>
						</li>
					</ol>
				</section>

				<section className={s.section}>
					<h2 className={s.sectionTitle}>Структура главного меню</h2>
					<p className={s.text}>Главное меню системы состоит из шести пунктов:</p>

					<ol className={s.sectionList}>
						<li>
							<span className={s.menuItemTitle}>«Продукты и данные»</span> – основной раздел,
							содержащий весь функционал для работы с данными и их визуализации.
						</li>
						<li>
							<span className={s.menuItemTitle}>«О проекте»</span> – содержит общую информацию о
							проекте.
						</li>
						<li>
							<span className={s.menuItemTitle}>«Публикации»</span> – включает список научных
							публикаций, посвященных исследованию состояния озера Байкал.
						</li>
						<li>
							<span className={s.menuItemTitle}>«Внешние ресурсы»</span> – предоставляет ссылки на
							сторонние интернет-ресурсы, связанные с мониторингом Байкала и Байкальской природной
							территории.
						</li>
						<li>
							<span className={s.menuItemTitle}>«Руководство пользователя»</span> – содержит
							инструкцию по работе с системой.
						</li>
						<li>
							<span className={s.menuItemTitle}>«Обратная связь»</span> – предназначен для связи с
							разработчиками и сообщения о проблемах в работе системы.
						</li>
					</ol>
				</section>
			</Box>

			{/* <Box className={s.page__sidebar}>
				<Box className={s.page__gallery}>
					<AboutRecordFeed />
				</Box>

				{userRights.some((role) => role === EAppRole.ADMIN) && (
					<Box className={s.page__adminControls}>
						<CreateEntity type="about-record" />
					</Box>
				)}
			</Box> */}
		</Box>
	);
};

export { About };

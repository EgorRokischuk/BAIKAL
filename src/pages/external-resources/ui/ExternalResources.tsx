import { Box } from '@mui/material';
import { CreateEntity } from '@/features/create-entity';
import { getUserRights } from '@/entities/User';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { EAppRole } from '@/shared/types';
import * as s from './ExternalResources.module.scss';

const ExternalResources: React.FC = () => {
	const userRights = useAppSelector(getUserRights);
	const isAdmin = userRights.some((role) => role === EAppRole.ADMIN);

	return (
		<Box className={s.page}>
			<Box className={s.page__content}>
				<header className={s.page__header}>
					<h1 className={s.title}>Внешние ресурсы</h1>
					<p className={s.subtitle}>
						Мониторинг Байкала: ссылки и ресурсы.
					</p>
				</header>

				<section className={s.section}>
					<div className={s.tableWrapper}>
						<table className={s.table}>
							<thead>
								<tr>
									<th>№</th>
									<th>Наименование ресурса</th>
									<th>Ссылка</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>Байкал из космоса</td>
									<td>
										<a
											className={s.link}
											href="https://baikal-space.ucoz.ru"
											target="_blank"
											rel="noopener noreferrer"
										>
											https://baikal-space.ucoz.ru
										</a>
									</td>
								</tr>
								<tr>
									<td>2</td>
									<td>ООО «Байкальский Центр»</td>
									<td>
										<a
											className={s.link}
											href="http://sputnik.irk.ru"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://sputnik.irk.ru
										</a>
									</td>
								</tr>
								<tr>
									<td>3</td>
									<td>ВЕГА-Science</td>
									<td>
										<a
											className={s.link}
											href="http://sci-vega.ru"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://sci-vega.ru
										</a>
									</td>
								</tr>
								<tr>
									<td>4</td>
									<td>ЦКП «ИКИ-Мониторинг»</td>
									<td>
										<a
											className={s.link}
											href="http://ckp.geosmis.ru"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://ckp.geosmis.ru
										</a>
									</td>
								</tr>
								<tr>
									<td>5</td>
									<td>Батиметрия проект INTAS 2002</td>
									<td>
										<a
											className={s.link}
											href="http://www.lin.irk.ru/intas/"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://www.lin.irk.ru/intas/
										</a>
									</td>
								</tr>
								<tr>
									<td>6</td>
									<td>Батиметрия, многолучевой эхолот 2009</td>
									<td>
										<a
											className={s.link}
											href="http://lin.irk.ru/multibeam/ru/"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://lin.irk.ru/multibeam/ru/
										</a>
									</td>
								</tr>
								<tr>
									<td>7</td>
									<td>База данных кернов со дна озера Байкал</td>
									<td>
										<a
											className={s.link}
											href="http://lin.irk.ru/geology/web/index.php?r=site%2Fru"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://lin.irk.ru/geology/web/index.php?r=site%2Fru
										</a>
									</td>
								</tr>
								<tr>
									<td>8</td>
									<td>Динамика температуры воды прибрежной зоны озера Байкал</td>
									<td>
										<a
											className={s.link}
											href="http://lin.irk.ru/temperature/web/index.php"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://lin.irk.ru/temperature/web/index.php
										</a>
									</td>
								</tr>
								<tr>
									<td>9</td>
									<td>Геолого-геофизические работы (с 1989 г.)</td>
									<td>
										<a
											className={s.link}
											href="http://lin.irk.ru/map_baikal/"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://lin.irk.ru/map_baikal/
										</a>
									</td>
								</tr>
								<tr>
									<td>10</td>
									<td>ЛИН СО РАН</td>
									<td>
										<a
											className={s.link}
											href="http://lin.irk.ru"
											target="_blank"
											rel="noopener noreferrer"
										>
											http://lin.irk.ru 	
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
			</Box>

			{isAdmin && (
				<Box className={s.page__sidebar}>
					<Box className={s.page__adminControls}>
						<h2 className={s.sectionTitle}>Управление ресурсами</h2>
						<p className={s.text}>
							Администратор может добавлять новые внешние ресурсы в систему.
						</p>
						<CreateEntity type="external-resource" />
					</Box>
				</Box>
			)}
		</Box>
	);
};

export { ExternalResources };

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Collapse, Fade, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import * as s from './Menu.module.scss';
import { ArrowForwardIos } from "@mui/icons-material";
import { warn } from "console";

const TabMenuHeader = (props: any) => {
	const { tabIndex, setTabIndex, tabs } = props;

	return (
		<Tabs
			value={tabIndex}
			onChange={(e, index) => { setTabIndex(index) }}
			variant='fullWidth'
		>
			{tabs.map((tab: any) => (<Tab disabled={!tab.enabled} label={tab.title} sx={{ textTransform: 'none' }} />))}
		</Tabs>
	)
};

const MenuBody = (props: any) => {
	const { tabs, tabIndex } = props;

	let index = 0;
	return (
		<div>
			{tabs.map((tab: any) => (<TabPanel value={tabIndex} index={index++}>{tab.content}</TabPanel>))}
		</div>
	)
}


const TabPanel = (props: any) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 0 }}>{children}</Box>}
		</div>
	);
}

const TabMenu = (props: any) => {
	const { tabs } = props;

	let firstActiveTab = 0;

	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i]
		if(tab.enabled === true) {
			firstActiveTab = i
			break;
		}
	}

	console.warn(firstActiveTab);

	const [tabIndex, setTabIndex] = useState(firstActiveTab);

	return (
		<div>
			<TabMenuHeader tabIndex={tabIndex} setTabIndex={setTabIndex} tabs={tabs} />
			<MenuBody tabs={tabs} tabIndex={tabIndex} />
		</div>
	)
}

const Accordions = () => {
	const [expanded, setExpanded] = useState<any>(false)

	const makeChangeHandler = (panel: any) => (event: any, isExpanded: any) => { setExpanded(isExpanded ? panel : false) }

	return (<>
		<Accordion expanded={expanded === 'panel1'} onChange={makeChangeHandler('panel1')}>
			<AccordionSummary>
				<Typography>Средние ежегодные</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<DatePicker views={['year', 'month']} label='Месяц и год' />
			</AccordionDetails>
		</Accordion>
		<Accordion expanded={expanded === 'panel2'} onChange={makeChangeHandler('panel2')}>
			<AccordionSummary>
				<Typography>Многолетние среднемесячные</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<DatePicker views={['month']} label='Месяц' />
			</AccordionDetails>
		</Accordion>
	</>)
}

const RadioDayNight = () => (<div className={s.radio_group}>
	<RadioGroup>
		<FormControlLabel value='daily' control={(<Radio />)} label='дневные' />
		<FormControlLabel value='nigthly' control={(<Radio />)} label='ночные' />
	</RadioGroup>
</div>)

const MenuHeader = (props: any) => {
	const { onClick } = props;
	return (<div className={s.header}
		onClick={onClick}>
		<ArrowBackIosIcon />
		<Typography color='primary' align='center' >Продукты</Typography>
		<div />
	</div>)
}

const Menu = () => {
	const menuStructure = [
		{
			title: 'Озеро Байкал',
			enabled: true,
			content: (<TabMenu tabs={[
				{
					title: 'LST',
					enabled: true,
					content: (<TabMenu tabs={[
						{
							title: 'VIIRS',
							enabled: false,
							content: (<Accordions />),
						},
						{
							title: 'MODIS Terra',
							enabled: false,
							content: (<>
								<RadioDayNight />
								<Accordions />
							</>),
						},
						{
							title: 'MODIS AQUA',
							enabled: false,
							content: (<>
								<RadioDayNight />
								<Accordions />
							</>),
						},
						{
							title: 'LANDSAT',
							enabled: true,
							content: (<TabMenu tabs={[
								{
									title: 4,
										enabled: true,
									content: (<DatePicker label='день' />),
								},
								{
									title: 5,

										enabled: true,
									content: (<DatePicker label='день' />),
								},
								{
									title: 6,
										enabled: true,
									content: (<DatePicker label='день' />),
								},
								{
									title: 7,
										enabled: true,
									content: (<DatePicker label='день' />),
								},
								{
									title: 8,
										enabled: true,
									content: (<DatePicker label='день' />),
								},
							]} />)
						},
					]} />),
				},
				{
					title: 'Хлорофил',
					enabled: false,
					content: null,
				},
				{
					title: 'Прозрачность',
					enabled: false,
					content: null,
				},
			]} />),
		},
		{
			title: 'Байкальская природная территория',
			enabled: false,
			content: null,
		},
		{
			title: 'Наземные данные',
			enabled: false,
			content: (<>
				<Accordion>
					<AccordionSummary>Тип данных</AccordionSummary>
					<AccordionDetails>
						<FormControlLabel control={(<Checkbox />)} label='Хлорофил' />
						<FormControlLabel control={(<Checkbox />)} label='Осадки' />
						<FormControlLabel control={(<Checkbox />)} label='Температура' />
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary>Источники данных</AccordionSummary>
					<AccordionDetails>
						<FormControlLabel control={(<Checkbox />)} label='Томск' />
						<FormControlLabel control={(<Checkbox />)} label='Севастополь' />
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary>Выбор даты</AccordionSummary>
					<AccordionDetails>
						<DatePicker label='день' />
					</AccordionDetails>
				</Accordion>
			</>),
		},
	];

	const [collapsed, setCollapsed] = useState(false)

	return (<>
		<Collapse in={collapsed} >
			<ArrowForwardIos onClick={() => setCollapsed(false)} />
		</Collapse>
		<Collapse in={!collapsed} >
			<div className={s.container}>
				<MenuHeader onClick={() => setCollapsed(true)} />
				<TabMenu tabs={menuStructure} />
				<div className={s.footer}>
					<Button variant='contained'><DownloadIcon /></Button>
					<Button variant='contained'>Подтвердить</Button>
					<Button><InfoIcon /></Button>
				</div>
			</div>
		</Collapse>
	</>)
}


export default Menu

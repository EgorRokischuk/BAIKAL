import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { Box, IconButton, Slide, Typography } from '@mui/material';
import classNames from 'classnames';
import { PropsWithChildren, useRef, useState } from 'react';
import * as s from './Panel.module.scss';

interface IPanelProps {
	dir?: 'right' | 'left';
	header?: string;
	width?: string;
}

interface IPanel extends React.FC<PropsWithChildren<IPanelProps>> {
	Content: typeof PanelContent;
	Actions: typeof PanelActions;
}

const PanelContent: React.FC<PropsWithChildren> = ({ children }) => {
	return <Box>{children}</Box>;
};

const PanelActions: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<Box className={s.panel__footer}>
			{children}
			<IconButton>
				<InfoIcon />
			</IconButton>
		</Box>
	);
};

const Panel: IPanel = ({ children, dir = 'right', header = 'Panel', width = '320px' }) => {
	const boxRef = useRef<HTMLElement>(null);
	const [collapsed, setCollapsed] = useState(false);

	return (
		<Box ref={boxRef}>
			<IconButton
				className={classNames({
					[s.btn]: true,
					[s.btn__right]: dir === 'right',
					[s.btn__left]: dir === 'left',
				})}
				onClick={() => setCollapsed(true)}
			>
				{dir === 'right' ? <ArrowForwardIos /> : <ArrowBackIos />}
			</IconButton>

			<Slide in={collapsed} container={boxRef.current} direction={dir} mountOnEnter unmountOnExit>
				<Box className={s.panel} sx={{ width }}>
					<Box className={s.panel__header}>
						{dir === 'right' ? (
							<IconButton onClick={() => setCollapsed(false)}>
								<ArrowBackIos />
							</IconButton>
						) : (
							<div style={{ width: '40px' }} />
						)}
						<Typography variant="map_menu_label" align="center">
							{header}
						</Typography>
						{dir === 'left' ? (
							<IconButton onClick={() => setCollapsed(false)}>
								<ArrowForwardIos />
							</IconButton>
						) : (
							<div style={{ width: '40px' }} />
						)}
					</Box>

					{children}
				</Box>
			</Slide>
		</Box>
	);
};

Panel.Content = PanelContent;
Panel.Actions = PanelActions;

export { Panel };

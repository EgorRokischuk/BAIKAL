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
        const [openButtonVisible, setOpenButtonVisible] = useState(true);

        const handleOpen = () => {
                setOpenButtonVisible(false);
                setCollapsed(true);
        };

        const handleClose = () => {
                setCollapsed(false);
                setOpenButtonVisible(false);
        };

        return (
                <Box ref={boxRef}>
                        {openButtonVisible && !collapsed && (
                                <IconButton
                                        className={classNames({
                                                [s.btn]: true,
                                                [s.btn__right]: dir === 'right',
                                                [s.btn__left]: dir === 'left',
                                                [s.control_button]: true,
                                                [s.control_button_round]: true,
                                        })}
                                        onClick={handleOpen}
                                >
                                        {dir === 'right' ? <ArrowForwardIos /> : <ArrowBackIos />}
                                </IconButton>
                        )}

                        <Slide
                                in={collapsed}
                                container={boxRef.current}
                                direction={dir}
                                mountOnEnter
                                unmountOnExit
                                onExited={() => setOpenButtonVisible(true)}
                        >
                                <Box className={s.panel} sx={{ width }}>
                                        <Box className={s.panel__header}>
                                                {dir === 'right' ? (
                                                        <IconButton
                                                                className={s.control_button}
                                                                onClick={() => setCollapsed(false)}
                                                        >
                                                                <ArrowBackIos className={s.control_icon} />
                                                        </IconButton>
                                                ) : (
                                                        <div style={{ width: '40px' }} />
                                                )}
                                                <Typography variant="map_menu_label" align="center">
                                                        {header}
                                                </Typography>
                                                {dir === 'left' ? (
                                                        <IconButton
                                                                className={s.control_button}
                                                                onClick={() => setCollapsed(false)}
                                                        >
                                                                <ArrowForwardIos className={s.control_icon} />
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

import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { geeActions } from '@/store/slices/geeSlice';
import { selectGee } from '@/store/slices/geeSelectors';
import {
  useLazyGetPointValuePeriodQuery,
  useLazyGetPolygonValuePeriodQuery,
} from '@/modules/gee/geeApi';
import type { GeePolygonResponse } from '@/modules/gee/model/types';
import { AvailabilityDatePicker } from './AvailabilityDatePicker';

export const GeePanel = () => {
  const dispatch = useAppDispatch();
  const gee = useAppSelector(selectGee);

  const [getPointValuePeriod] = useLazyGetPointValuePeriodQuery();
  const [getPolygonValuePeriod] = useLazyGetPolygonValuePeriodQuery();

  const shouldDisable =
    gee.type === 'point'
      ? !gee.dateStart || !gee.dateEnd || gee.point.length !== 2
      : !gee.dateStart || !gee.dateEnd || gee.shape.length !== 4;

  const onConfirm = async () => {
    if (!gee.dateStart || !gee.dateEnd) {
      return;
    }

    switch (gee.type) {
      case 'point': {
        await getPointValuePeriod(gee);
        break;
      }
      case 'polygon': {
        const response = await getPolygonValuePeriod(gee);

        const url = (response.data as GeePolygonResponse | undefined)?.url;
        if (url) {
          window.open(url, '_blank');
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <Stack spacing={1.2}>
      <RadioGroup
        row
        value={gee.type}
        onChange={(_, value) => dispatch(geeActions.setGeeType(value as 'point' | 'polygon'))}
      >
        <FormControlLabel value="point" control={<Radio size="small" />} label="Точка" />
        <FormControlLabel value="polygon" control={<Radio size="small" />} label="Полигон" />
      </RadioGroup>

      <AvailabilityDatePicker
        type="gee"
        label="Дата начала"
        value={gee.dateStart}
        onChange={(value) => dispatch(geeActions.setGeeDate({ key: 'dateStart', value }))}
        availableDates={[]}
        disableWhenNoAvailability={false}
        maxDate={dayjs()}
      />
      <AvailabilityDatePicker
        type="gee"
        label="Дата окончания"
        value={gee.dateEnd}
        onChange={(value) => dispatch(geeActions.setGeeDate({ key: 'dateEnd', value }))}
        availableDates={[]}
        disableWhenNoAvailability={false}
        minDate={gee.dateStart ?? undefined}
        maxDate={dayjs()}
      />

      <Box>
        <Typography variant="caption" color="text.secondary">
          {gee.type === 'point'
            ? 'Кликните по карте, чтобы поставить точку.'
            : 'Кликните 4 раза по карте, чтобы задать вершины полигона.'}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={onConfirm} disabled={shouldDisable}>
          Подтвердить
        </Button>
        {gee.type === 'point' ? (
          <Button variant="outlined" color="inherit" onClick={() => dispatch(geeActions.clearPoint())}>
            Очистить точку
          </Button>
        ) : (
          <Button variant="outlined" color="inherit" onClick={() => dispatch(geeActions.clearShape())}>
            Очистить полигон
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

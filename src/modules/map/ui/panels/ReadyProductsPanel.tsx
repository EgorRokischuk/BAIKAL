import { useEffect, useMemo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mapActions } from '@/store/slices/mapSlice';
import { selectTileOptionByKey } from '@/store/slices/mapSelectors';
import {
  useGetMonthlyAvgDatesQuery,
  useGetMonthlyAvgManyYearsDatesQuery,
} from '@/modules/map/mapApi';
import {
  deviceDictionary,
  parameterDictionary,
  photoTimeDictionary,
  resolveSatelliteDataType,
} from '@/modules/map/model/dictionaries';
import { TileDateControl } from './TileDateControl';

const landsatSensors = [
  { title: '4', disabled: true },
  { title: '5', disabled: true },
  { title: '6', disabled: true },
  { title: '7', disabled: true },
  { title: '8', disabled: false },
  { title: '9', disabled: true },
];

const photoTimeOptions = [
  { value: 'daily', label: 'Дневные' },
  { value: 'nightly', label: 'Ночные' },
  { value: 'diurnal', label: 'Суточные' },
] as const;

type PhotoTimeOptionValue = (typeof photoTimeOptions)[number]['value'];
type ModeAvailability = {
  hasMonthlyAvg: boolean;
  hasMonthlyAvgManyYears: boolean;
  hasAny: boolean;
  isLoading: boolean;
};

const compactTabsSx = {
  minHeight: 34,
  '& .MuiTab-root': {
    minHeight: 34,
    py: 0.4,
    px: 1,
    fontSize: '0.76rem',
    textTransform: 'none',
    fontWeight: 700,
  },
  '& .MuiTabs-indicator': {
    height: 2,
  },
} as const;

const compactAccordionSx = {
  '& .MuiAccordionSummary-root': {
    minHeight: 36,
    px: 1,
  },
  '& .MuiAccordionSummary-content': {
    my: 0.5,
  },
  '& .MuiAccordionDetails-root': {
    pt: 0.5,
    pb: 0.75,
    px: 1,
  },
} as const;

export const ReadyProductsPanel = () => {
  const dispatch = useAppDispatch();

  const parameter = useAppSelector(selectTileOptionByKey('parameter'));
  const source = useAppSelector(selectTileOptionByKey('source'));
  const photoTime = useAppSelector(selectTileOptionByKey('photoTime'));
  const type = useAppSelector(selectTileOptionByKey('type'));
  const productType = useAppSelector(selectTileOptionByKey('productType'));

  const canCheckTemperatureModes =
    parameter === 'temperature' &&
    productType === 'baikalRiver' &&
    Boolean(source) &&
    source !== 'landsat';

  const commonTemperatureArgs = useMemo(
    () => ({
      data_type: resolveSatelliteDataType(String(productType)),
      device: source ? deviceDictionary[String(source)] ?? '' : '',
      parameter: parameterDictionary.temperature,
      silent: true,
    }),
    [productType, source],
  );

  const dailyMonthlyAvg = useGetMonthlyAvgDatesQuery(
    {
      ...commonTemperatureArgs,
      time_of_day: photoTimeDictionary.daily,
    },
    { skip: !canCheckTemperatureModes },
  );

  const dailyMonthlyAvgManyYears = useGetMonthlyAvgManyYearsDatesQuery(
    {
      ...commonTemperatureArgs,
      time_of_day: photoTimeDictionary.daily,
    },
    { skip: !canCheckTemperatureModes },
  );

  const nightlyMonthlyAvg = useGetMonthlyAvgDatesQuery(
    {
      ...commonTemperatureArgs,
      time_of_day: photoTimeDictionary.nightly,
    },
    { skip: !canCheckTemperatureModes },
  );

  const nightlyMonthlyAvgManyYears = useGetMonthlyAvgManyYearsDatesQuery(
    {
      ...commonTemperatureArgs,
      time_of_day: photoTimeDictionary.nightly,
    },
    { skip: !canCheckTemperatureModes },
  );

  const diurnalMonthlyAvg = useGetMonthlyAvgDatesQuery(
    {
      ...commonTemperatureArgs,
      time_of_day: photoTimeDictionary.diurnal,
    },
    { skip: !canCheckTemperatureModes },
  );

  const diurnalMonthlyAvgManyYears = useGetMonthlyAvgManyYearsDatesQuery(
    {
      ...commonTemperatureArgs,
      time_of_day: photoTimeDictionary.diurnal,
    },
    { skip: !canCheckTemperatureModes },
  );

  const temperatureModeAvailability = useMemo<Record<PhotoTimeOptionValue, ModeAvailability>>(() => {
    const buildAvailability = (
      monthlyAvg: { data?: string[]; isFetching: boolean },
      monthlyAvgManyYears: { data?: string[]; isFetching: boolean },
    ): ModeAvailability => {
      const hasMonthlyAvg = Boolean(monthlyAvg.data?.length);
      const hasMonthlyAvgManyYears = Boolean(monthlyAvgManyYears.data?.length);

      return {
        hasMonthlyAvg,
        hasMonthlyAvgManyYears,
        hasAny: hasMonthlyAvg || hasMonthlyAvgManyYears,
        isLoading: monthlyAvg.isFetching || monthlyAvgManyYears.isFetching,
      };
    };

    return {
      daily: buildAvailability(dailyMonthlyAvg, dailyMonthlyAvgManyYears),
      nightly: buildAvailability(nightlyMonthlyAvg, nightlyMonthlyAvgManyYears),
      diurnal: buildAvailability(diurnalMonthlyAvg, diurnalMonthlyAvgManyYears),
    };
  }, [
    dailyMonthlyAvg,
    dailyMonthlyAvgManyYears,
    nightlyMonthlyAvg,
    nightlyMonthlyAvgManyYears,
    diurnalMonthlyAvg,
    diurnalMonthlyAvgManyYears,
  ]);

  const visiblePhotoTimeOptions = useMemo(() => {
    if (!canCheckTemperatureModes) {
      return photoTimeOptions;
    }

    return photoTimeOptions.filter(({ value }) => {
      const mode = temperatureModeAvailability[value];
      return mode.isLoading || mode.hasAny;
    });
  }, [canCheckTemperatureModes, temperatureModeAvailability]);

  const selectedPhotoTime = photoTimeOptions.some((option) => option.value === photoTime)
    ? (photoTime as PhotoTimeOptionValue)
    : null;

  const effectivePhotoTime = selectedPhotoTime ?? (visiblePhotoTimeOptions[0]?.value ?? null);

  const selectedModeAvailability = effectivePhotoTime
    ? temperatureModeAvailability[effectivePhotoTime]
    : null;

  const isMonthlyAvgVisible =
    !canCheckTemperatureModes ||
    Boolean(selectedModeAvailability?.isLoading || selectedModeAvailability?.hasMonthlyAvg);

  const isMonthlyAvgManyYearsVisible =
    !canCheckTemperatureModes ||
    Boolean(selectedModeAvailability?.isLoading || selectedModeAvailability?.hasMonthlyAvgManyYears);

  useEffect(() => {
    if (parameter !== 'temperature') return;
    if (!source || source === 'landsat') return;

    const firstVisibleMode = visiblePhotoTimeOptions[0]?.value ?? null;
    const isCurrentModeVisible =
      Boolean(photoTime) && visiblePhotoTimeOptions.some((option) => option.value === photoTime);

    if (!isCurrentModeVisible) {
      if (photoTime !== firstVisibleMode) {
        dispatch(mapActions.setTileOption({ key: 'photoTime', value: firstVisibleMode }));
      }

      if (!firstVisibleMode && type !== null) {
        dispatch(mapActions.setTileOption({ key: 'type', value: null }));
      }

      return;
    }

    const visibleTypes: Array<'monthlyAvg' | 'monthlyAvgManyYears'> = [];
    if (isMonthlyAvgVisible) visibleTypes.push('monthlyAvg');
    if (isMonthlyAvgManyYearsVisible) visibleTypes.push('monthlyAvgManyYears');

    const isCurrentTypeVisible =
      (type === 'monthlyAvg' && isMonthlyAvgVisible) ||
      (type === 'monthlyAvgManyYears' && isMonthlyAvgManyYearsVisible);

    if (!isCurrentTypeVisible) {
      const nextType = visibleTypes[0] ?? null;
      if (type !== nextType) {
        dispatch(mapActions.setTileOption({ key: 'type', value: nextType }));
      }
    }
  }, [
    dispatch,
    parameter,
    photoTime,
    source,
    type,
    visiblePhotoTimeOptions,
    isMonthlyAvgVisible,
    isMonthlyAvgManyYearsVisible,
  ]);

  return (
    <Stack spacing={1.4}>
      <Tabs
        value={['temperature', 'chlorophyll', 'transparency'].indexOf(String(parameter))}
        onChange={(_, index) => {
          const values = ['temperature', 'chlorophyll', 'transparency'];
          dispatch(mapActions.setTileOption({ key: 'parameter', value: values[index] }));
        }}
        variant="fullWidth"
        sx={compactTabsSx}
      >
        <Tab label="Температура" />
        <Tab label="Хлорофилл" />
        <Tab label="Прозрачность" disabled />
      </Tabs>

      {parameter === 'temperature' && (
        <>
          <Tabs
            value={['viirs', 'terra', 'aqua', 'landsat'].indexOf(String(source))}
            onChange={(_, index) => {
              const values = ['viirs', 'terra', 'aqua', 'landsat'];
              dispatch(mapActions.setTileOption({ key: 'source', value: values[index] }));
            }}
            variant="fullWidth"
            sx={compactTabsSx}
          >
            <Tab label="VIIRS" />
            <Tab label="Terra" />
            <Tab label="Aqua" />
            <Tab label="Landsat" />
          </Tabs>

          {source === 'landsat' && (
            <>
              <Tabs value={4} variant="scrollable" scrollButtons="auto" sx={compactTabsSx}>
                {landsatSensors.map((sensor, index) => (
                  <Tab key={sensor.title} label={sensor.title} value={index} disabled={sensor.disabled} />
                ))}
              </Tabs>
              <TileDateControl
                type="landsat"
                label="Дата"
                views={['year', 'month', 'day']}
                openTo="year"
                format="DD.MM.YYYY"
              />
            </>
          )}

          {source && source !== 'landsat' && (
            <>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Тип наблюдений
                </Typography>

                {!!visiblePhotoTimeOptions.length && (
                  <RadioGroup
                    row
                    value={photoTime ?? ''}
                    onChange={(_, value) =>
                      dispatch(mapActions.setTileOption({ key: 'photoTime', value }))
                    }
                  >
                    {visiblePhotoTimeOptions.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio size="small" />}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup>
                )}

                {!visiblePhotoTimeOptions.length && (
                  <Typography variant="caption" color="text.secondary">
                    Для выбранного источника нет доступных режимов наблюдений.
                  </Typography>
                )}
              </Box>

              {isMonthlyAvgVisible && (
                <Accordion
                  disableGutters
                  expanded={type === 'monthlyAvg'}
                  onChange={(_, expanded) =>
                    dispatch(mapActions.setTileOption({ key: 'type', value: expanded ? 'monthlyAvg' : null }))
                  }
                  sx={compactAccordionSx}
                >
                  <AccordionSummary>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Среднемесячные
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TileDateControl type="monthlyAvg" label="Месяц и год" views={['year', 'month']} />
                  </AccordionDetails>
                </Accordion>
              )}

              {isMonthlyAvgManyYearsVisible && (
                <Accordion
                  disableGutters
                  expanded={type === 'monthlyAvgManyYears'}
                  onChange={(_, expanded) =>
                    dispatch(
                      mapActions.setTileOption({
                        key: 'type',
                        value: expanded ? 'monthlyAvgManyYears' : null,
                      }),
                    )
                  }
                  sx={compactAccordionSx}
                >
                  <AccordionSummary>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Многолетнее среднемесячное
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TileDateControl type="monthlyAvgManyYears" label="Месяц" views={['month']} />
                  </AccordionDetails>
                </Accordion>
              )}

              {!isMonthlyAvgVisible && !isMonthlyAvgManyYearsVisible && (
                <Typography variant="caption" color="text.secondary">
                  Для выбранного режима нет доступных дат.
                </Typography>
              )}
            </>
          )}
        </>
      )}

      {parameter === 'chlorophyll' && (
        <>
          <Typography variant="body2" color="text.secondary">
            Источник: Sentinel-2
          </Typography>
          <TileDateControl type="chlorophyll" label="Месяц" views={['year', 'month']} />
        </>
      )}

      {parameter === 'transparency' && (
        <Typography color="text.secondary">Продукт «Прозрачность» пока недоступен.</Typography>
      )}

      {!source && parameter !== 'transparency' && (
        <Typography variant="caption" color="text.secondary">
          Выберите источник данных.
        </Typography>
      )}
    </Stack>
  );
};

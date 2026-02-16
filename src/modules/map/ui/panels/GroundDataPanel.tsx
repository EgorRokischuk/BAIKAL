import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Select, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mapActions } from '@/store/slices/mapSlice';
import {
  selectGroundDataOptions,
  selectTileOptionByKey,
  selectTileOptions,
} from '@/store/slices/mapSelectors';
import {
  useGetGroundDataParametersQuery,
  useGetGroundDataSourcesQuery,
} from '@/modules/map/mapApi';
import { toApiDate } from '@/shared/lib/date';
import { TileDateControl } from './TileDateControl';

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

export const GroundDataPanel = () => {
  const dispatch = useAppDispatch();
  const options = useAppSelector(selectGroundDataOptions);
  const parameter = useAppSelector(selectTileOptionByKey('parameter'));
  const source = useAppSelector(selectTileOptionByKey('source'));
  const tileOptions = useAppSelector(selectTileOptions);

  const parameterQuery = useGetGroundDataParametersQuery(
    {
      startDate: toApiDate(options.startDate) || '',
      endDate: toApiDate(options.endDate),
    },
    { skip: !options.startDate || tileOptions.type !== 'groundData' },
  );

  const sourceQuery = useGetGroundDataSourcesQuery(
    {
      parameter: String(options.parameter || ''),
      startDate: toApiDate(options.startDate) || '',
      endDate: toApiDate(options.endDate),
    },
    {
      skip:
        !options.startDate ||
        !options.parameter ||
        tileOptions.type !== 'groundData',
    },
  );

  return (
    <Stack spacing={1.2}>
      <Accordion defaultExpanded sx={compactAccordionSx}>
        <AccordionSummary>Выбор диапазона дат</AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            <TileDateControl type="groundData" label="Дата начала" />
            <TileDateControl type="groundData" label="Дата окончания" dateKey="endDate" />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion disabled={!options.startDate || !parameterQuery.data?.length} sx={compactAccordionSx}>
        <AccordionSummary>Параметр</AccordionSummary>
        <AccordionDetails>
          <Select
            fullWidth
            size="small"
            value={parameter}
            disabled={parameterQuery.isFetching}
            onChange={(event) =>
              dispatch(mapActions.setTileOption({ key: 'parameter', value: event.target.value }))
            }
          >
            {(parameterQuery.data || []).map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={!options.startDate || !options.parameter || !sourceQuery.data?.length}
        sx={compactAccordionSx}
      >
        <AccordionSummary>Источник</AccordionSummary>
        <AccordionDetails>
          <Select
            fullWidth
            size="small"
            value={source}
            disabled={sourceQuery.isFetching}
            onChange={(event) =>
              dispatch(mapActions.setTileOption({ key: 'source', value: event.target.value }))
            }
          >
            {(sourceQuery.data || []).map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

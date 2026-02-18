import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useMemo, useState } from 'react';
import styles from './DownloadStatisticsBuilder.module.scss';

type ProductId = 'viirs' | 'modis' | 'landsat' | 'sentinel';
type MetricId =
  | 'temperatureMean'
  | 'temperatureMin'
  | 'temperatureMax'
  | 'temperatureAnomaly'
  | 'chlorophyll'
  | 'downloadsCount'
  | 'downloadVolumeGb';
type ChartType = 'line' | 'area' | 'bar' | 'histogram';
type GroupBy = 'month' | 'quarter' | 'year';
type Aggregation = 'avg' | 'sum' | 'min' | 'max' | 'median';
type Normalization = 'none' | 'index100' | 'deltaPercent';

interface SeriesPoint {
  timestamp: number;
  label: string;
  value: number;
}

interface Series {
  productId: ProductId;
  label: string;
  color: string;
  points: SeriesPoint[];
}

const PRODUCTS: Array<{ id: ProductId; label: string; color: string }> = [
  { id: 'viirs', label: 'Температура поверхности (VIIRS)', color: '#1565c0' },
  { id: 'modis', label: 'Температура поверхности (MODIS Aqua)', color: '#d84315' },
  { id: 'landsat', label: 'Landsat LST', color: '#2e7d32' },
  { id: 'sentinel', label: 'Хлорофилл (Sentinel-2)', color: '#6a1b9a' },
];

const METRICS: Array<{ id: MetricId; label: string; unit: string; note: string }> = [
  { id: 'temperatureMean', label: 'Средняя температура поверхности', unit: '°C', note: 'Среднее значение температуры по продукту.' },
  { id: 'temperatureMin', label: 'Минимальная температура', unit: '°C', note: 'Минимум температуры за период.' },
  { id: 'temperatureMax', label: 'Максимальная температура', unit: '°C', note: 'Максимум температуры за период.' },
  { id: 'temperatureAnomaly', label: 'Температурная аномалия', unit: '°C', note: 'Отклонение от климатической нормы.' },
  { id: 'chlorophyll', label: 'Хлорофилл-a', unit: 'мг/м³', note: 'Концентрация хлорофилла.' },
  { id: 'downloadsCount', label: 'Число скачиваний', unit: 'шт.', note: 'Количество скачиваний продукта.' },
  { id: 'downloadVolumeGb', label: 'Объем скачиваний', unit: 'ГБ', note: 'Общий объем скачанных файлов.' },
];

const CHART_TYPES: Array<{ id: ChartType; label: string }> = [
  { id: 'line', label: 'Линейный график' },
  { id: 'area', label: 'Область' },
  { id: 'bar', label: 'Столбцы' },
  { id: 'histogram', label: 'Гистограмма' },
];

const GROUPINGS: Array<{ id: GroupBy; label: string }> = [
  { id: 'month', label: 'По месяцам' },
  { id: 'quarter', label: 'По кварталам' },
  { id: 'year', label: 'По годам' },
];

const AGGREGATIONS: Array<{ id: Aggregation; label: string }> = [
  { id: 'avg', label: 'Среднее' },
  { id: 'sum', label: 'Сумма' },
  { id: 'min', label: 'Минимум' },
  { id: 'max', label: 'Максимум' },
  { id: 'median', label: 'Медиана' },
];

const NORMALIZATIONS: Array<{ id: Normalization; label: string }> = [
  { id: 'none', label: 'Без нормализации' },
  { id: 'index100', label: 'Индекс (первая точка = 100)' },
  { id: 'deltaPercent', label: 'Прирост к первой точке, %' },
];

const PRODUCT_LABELS = PRODUCTS.reduce<Record<ProductId, string>>(
  (acc, item) => ({ ...acc, [item.id]: item.label }),
  { viirs: '', modis: '', landsat: '', sentinel: '' },
);

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

const rows = Array.from({ length: 36 }, (_, idx) => {
  const year = 2023 + Math.floor(idx / 12);
  const month = (idx % 12) + 1;
  const date = `${year}-${String(month).padStart(2, '0')}-01`;

  return PRODUCTS.map((product, productIndex) => {
    const season = Math.sin((2 * Math.PI * month) / 12);
    const trend = idx * 0.05 + productIndex * 0.08;
    const base = 6.1 + season * 6 + trend;
    const downloadsCount = Math.max(0, Math.round(16 + productIndex * 4 + Math.max(0, season) * 27 + idx * 0.7));

    return {
      date,
      productId: product.id,
      values: {
        temperatureMean: round(base),
        temperatureMin: round(base - (3.4 + productIndex * 0.25 + Math.max(0, -season) * 1.1)),
        temperatureMax: round(base + (4.5 + productIndex * 0.35 + Math.max(0, season) * 1.5)),
        temperatureAnomaly: round((idx - 18) * 0.055 + season * 0.48 + productIndex * 0.1),
        chlorophyll: round(1.4 + productIndex * 0.35 + Math.max(0, season) * 2.2),
        downloadsCount,
        downloadVolumeGb: round(downloadsCount * (0.54 + productIndex * 0.08)),
      },
    };
  });
}).flat();

const DATES = Array.from(new Set(rows.map((row) => row.date))).sort();
const MIN_DATE = DATES[0] || '2023-01-01';
const MAX_DATE = DATES[DATES.length - 1] || '2025-12-01';
const ALL_PRODUCTS = PRODUCTS.map((item) => item.id);

const metricAccessor: Record<MetricId, (values: (typeof rows)[number]['values']) => number> = {
  temperatureMean: (values) => values.temperatureMean,
  temperatureMin: (values) => values.temperatureMin,
  temperatureMax: (values) => values.temperatureMax,
  temperatureAnomaly: (values) => values.temperatureAnomaly,
  chlorophyll: (values) => values.chlorophyll,
  downloadsCount: (values) => values.downloadsCount,
  downloadVolumeGb: (values) => values.downloadVolumeGb,
};

const aggregate = (values: number[], mode: Aggregation) => {
  if (!values.length) return Number.NaN;
  if (mode === 'sum') return values.reduce((acc, value) => acc + value, 0);
  if (mode === 'min') return Math.min(...values);
  if (mode === 'max') return Math.max(...values);
  if (mode === 'median') {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
  }
  return values.reduce((acc, value) => acc + value, 0) / values.length;
};

const normalize = (points: SeriesPoint[], mode: Normalization) => {
  if (mode === 'none' || !points.length) return points;
  const base = points[0].value;
  if (Math.abs(base) < 1e-6) return points;
  if (mode === 'index100') return points.map((point) => ({ ...point, value: (point.value / base) * 100 }));
  return points.map((point) => ({ ...point, value: ((point.value - base) / Math.abs(base)) * 100 }));
};

const smooth = (points: SeriesPoint[], windowSize: number) =>
  windowSize <= 1
    ? points
    : points.map((point, index) => {
        const start = Math.max(0, index - windowSize + 1);
        const chunk = points.slice(start, index + 1);
        const value = chunk.reduce((acc, item) => acc + item.value, 0) / chunk.length;
        return { ...point, value };
      });

const autoDomain = (values: number[], includeZero: boolean): [number, number] => {
  if (!values.length) return [0, 1];
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (includeZero) {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  if (min === max) {
    const pad = Math.abs(min) > 1 ? Math.abs(min) * 0.1 : 1;
    return [min - pad, max + pad];
  }
  const pad = (max - min) * 0.1;
  return [min - pad, max + pad];
};

const toGroupMeta = (date: string, groupBy: GroupBy) => {
  const [yearString, monthString] = date.split('-');
  const year = Number(yearString);
  const month = Number(monthString) - 1;

  if (groupBy === 'year') return { key: `${year}`, label: `${year}`, timestamp: Date.UTC(year, 0, 1) };
  if (groupBy === 'quarter') {
    const quarter = Math.floor(month / 3) + 1;
    return { key: `${year}-Q${quarter}`, label: `Q${quarter} ${year}`, timestamp: Date.UTC(year, (quarter - 1) * 3, 1) };
  }

  const mm = String(month + 1).padStart(2, '0');
  return { key: `${year}-${mm}`, label: `${mm}.${year}`, timestamp: Date.UTC(year, month, 1) };
};

const format = (value: number) => {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value) >= 1000) return value.toFixed(0);
  if (Math.abs(value) >= 100) return value.toFixed(1);
  return value.toFixed(2);
};

export const DownloadStatisticsBuilder = () => {
  const [tab, setTab] = useState(0);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [metricId, setMetricId] = useState<MetricId>('temperatureMean');
  const [products, setProducts] = useState<ProductId[]>(ALL_PRODUCTS);
  const [groupBy, setGroupBy] = useState<GroupBy>('month');
  const [aggregation, setAggregation] = useState<Aggregation>('avg');
  const [normalization, setNormalization] = useState<Normalization>('none');
  const [smoothing, setSmoothing] = useState(1);
  const [from, setFrom] = useState(MIN_DATE);
  const [to, setTo] = useState(MAX_DATE);
  const [bins, setBins] = useState(10);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [stackBars, setStackBars] = useState(false);
  const [manualAxis, setManualAxis] = useState(false);
  const [yMin, setYMin] = useState('');
  const [yMax, setYMax] = useState('');

  const metric = METRICS.find((item) => item.id === metricId) || METRICS[0];
  const period = from <= to ? { from, to } : { from: to, to: from };

  const prepared = useMemo(() => {
    const mapByProduct = new Map<ProductId, Map<string, { timestamp: number; label: string; values: number[] }>>();

    rows
      .filter((row) => products.includes(row.productId) && row.date >= period.from && row.date <= period.to)
      .forEach((row) => {
        const group = toGroupMeta(row.date, groupBy);
        const byGroup = mapByProduct.get(row.productId) || new Map<string, { timestamp: number; label: string; values: number[] }>();
        const bucket = byGroup.get(group.key) || { timestamp: group.timestamp, label: group.label, values: [] };
        bucket.values.push(metricAccessor[metricId](row.values));
        byGroup.set(group.key, bucket);
        mapByProduct.set(row.productId, byGroup);
      });

    const series: Series[] = products.map((productId) => {
      const source = Array.from(mapByProduct.get(productId)?.values() || [])
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((bucket) => ({ timestamp: bucket.timestamp, label: bucket.label, value: aggregate(bucket.values, aggregation) }))
        .filter((point) => Number.isFinite(point.value));

      return {
        productId,
        label: PRODUCT_LABELS[productId],
        color: PRODUCTS.find((item) => item.id === productId)?.color || '#1e88e5',
        points: smooth(normalize(source, normalization), smoothing),
      };
    });

    const timeline = Array.from(
      new Map(series.flatMap((seriesItem) => seriesItem.points.map((point) => [point.timestamp, point.label]))),
    )
      .map(([timestamp, label]) => ({ timestamp, label }))
      .sort((a, b) => a.timestamp - b.timestamp);

    return { series, timeline };
  }, [aggregation, groupBy, metricId, normalization, period.from, period.to, products, smoothing]);

  const hist = useMemo(() => {
    const values = prepared.series.flatMap((series) => series.points.map((point) => point.value));
    if (!values.length) return [] as Array<{ from: number; to: number; count: number }>;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const result = Array.from({ length: bins }, (_, index) => {
      const fromValue = max === min ? min : min + ((max - min) * index) / bins;
      const toValue = max === min ? max : min + ((max - min) * (index + 1)) / bins;
      return { from: fromValue, to: toValue, count: 0 };
    });
    if (max === min) {
      result[0].count = values.length;
      return result;
    }
    values.forEach((value) => {
      const index = Math.min(bins - 1, Math.floor(((value - min) / (max - min)) * bins));
      result[index].count += 1;
    });
    return result;
  }, [bins, prepared.series]);

  const manual = manualAxis && Number.isFinite(Number(yMin)) && Number.isFinite(Number(yMax)) && Number(yMin) < Number(yMax);
  const domain = useMemo<[number, number]>(
    () =>
      manual
        ? [Number(yMin), Number(yMax)]
        : chartType === 'histogram'
          ? autoDomain(hist.map((item) => item.count), true)
          : autoDomain(prepared.series.flatMap((series) => series.points.map((point) => point.value)), chartType === 'bar'),
    [chartType, hist, manual, prepared.series, yMax, yMin],
  );

  const valuesByProduct = prepared.series.map((series) => ({
    productId: series.productId,
    values: new Map(series.points.map((point) => [point.timestamp, point.value])),
    color: series.color,
  }));

  const width = 980;
  const height = 390;
  const left = 72;
  const right = 20;
  const top = 20;
  const bottom = 56;
  const innerW = width - left - right;
  const innerH = height - top - bottom;
  const xCount = chartType === 'histogram' ? hist.length : prepared.timeline.length;
  const xAt = (index: number) => left + (xCount <= 1 ? innerW / 2 : (index / (xCount - 1)) * innerW);
  const yAt = (value: number) => top + innerH - ((value - domain[0]) / (domain[1] - domain[0] || 1)) * innerH;
  const y0 = yAt(domain[0] <= 0 && domain[1] >= 0 ? 0 : domain[0]);
  const tickValues = Array.from({ length: 7 }, (_, index) => domain[1] - ((domain[1] - domain[0]) * index) / 6);
  const timelineIndex = new Map(prepared.timeline.map((point, index) => [point.timestamp, index]));
  const unit = normalization === 'index100' ? 'индекс' : normalization === 'deltaPercent' ? '%' : metric.unit;

  const onProductsChange = (event: SelectChangeEvent<ProductId[]>) => {
    const value = event.target.value;
    setProducts((typeof value === 'string' ? value.split(',') : value) as ProductId[]);
  };

  const isEmpty = chartType === 'histogram'
    ? !hist.some((bin) => bin.count > 0)
    : !prepared.series.some((series) => series.points.length > 0);

  return (
    <Paper className={styles.card}>
      <Typography variant="h2">Статистика во времени</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
        Конструктор графиков по продуктам: изменение температур, хлорофилла и активности скачиваний во времени.
      </Typography>

      <Tabs value={tab} onChange={(_, value: number) => setTab(value)} sx={{ mt: 1.8 }}>
        <Tab label="Конструктор графика" />
        <Tab label="Таблица данных" />
      </Tabs>

      {tab === 0 && (
        <Box className={styles.tabBody}>
          <div className={styles.controlsGrid}>
            <FormControl size="small"><InputLabel id="chart-type">Тип графика</InputLabel><Select labelId="chart-type" value={chartType} label="Тип графика" onChange={(event) => setChartType(event.target.value as ChartType)}>{CHART_TYPES.map((item) => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel id="metric">Метрика</InputLabel><Select labelId="metric" value={metricId} label="Метрика" onChange={(event) => setMetricId(event.target.value as MetricId)}>{METRICS.map((item) => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel id="products">Продукты</InputLabel><Select labelId="products" multiple value={products} label="Продукты" onChange={onProductsChange} renderValue={(selected) => selected.length ? selected.map((item) => PRODUCT_LABELS[item]).join(', ') : 'Не выбраны'}>{PRODUCTS.map((item) => <MenuItem key={item.id} value={item.id}><Checkbox checked={products.includes(item.id)} /><span>{item.label}</span></MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel id="group">Группировка</InputLabel><Select labelId="group" value={groupBy} label="Группировка" onChange={(event) => setGroupBy(event.target.value as GroupBy)}>{GROUPINGS.map((item) => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel id="aggregation">Агрегация</InputLabel><Select labelId="aggregation" value={aggregation} label="Агрегация" onChange={(event) => setAggregation(event.target.value as Aggregation)}>{AGGREGATIONS.map((item) => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel id="normalization">Нормализация</InputLabel><Select labelId="normalization" value={normalization} label="Нормализация" onChange={(event) => setNormalization(event.target.value as Normalization)}>{NORMALIZATIONS.map((item) => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}</Select></FormControl>
            <TextField size="small" type="date" label="Дата от" InputLabelProps={{ shrink: true }} inputProps={{ min: MIN_DATE, max: MAX_DATE }} value={from} onChange={(event) => setFrom(event.target.value)} />
            <TextField size="small" type="date" label="Дата до" InputLabelProps={{ shrink: true }} inputProps={{ min: MIN_DATE, max: MAX_DATE }} value={to} onChange={(event) => setTo(event.target.value)} />
            <TextField size="small" type="number" label="Окно сглаживания" value={smoothing} inputProps={{ min: 1, max: 12 }} onChange={(event) => setSmoothing(Math.max(1, Math.min(12, Math.floor(Number(event.target.value) || 1))))} />
            {chartType === 'histogram' && <div className={styles.sliderField}><Typography variant="body2" color="text.secondary">{`Корзины гистограммы: ${bins}`}</Typography><Slider value={bins} min={4} max={40} step={1} marks={[{ value: 4, label: '4' }, { value: 20, label: '20' }, { value: 40, label: '40' }]} onChange={(_, next) => setBins(next as number)} /></div>}
          </div>

          <Stack direction="row" spacing={1} sx={{ mt: 1.4, flexWrap: 'wrap' }}>
            <Button size="small" variant="outlined" onClick={() => setProducts(ALL_PRODUCTS)}>Выбрать все продукты</Button>
            <Button size="small" variant="outlined" onClick={() => setProducts([])}>Очистить выбор</Button>
          </Stack>

          <div className={styles.togglesRow}>
            <FormControlLabel control={<Switch checked={showGrid} onChange={(_, checked) => setShowGrid(checked)} />} label="Сетка" />
            <FormControlLabel control={<Switch checked={showLegend} onChange={(_, checked) => setShowLegend(checked)} />} label="Легенда" />
            <FormControlLabel control={<Switch checked={showPoints} onChange={(_, checked) => setShowPoints(checked)} />} label="Точки" />
            {chartType === 'bar' && <FormControlLabel control={<Switch checked={stackBars} onChange={(_, checked) => setStackBars(checked)} />} label="Стекирование" />}
            <FormControlLabel control={<Switch checked={manualAxis} onChange={(_, checked) => setManualAxis(checked)} />} label="Ручной диапазон Y" />
          </div>

          {manualAxis && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} sx={{ mt: 0.8 }}>
              <TextField size="small" type="number" label="Y min" value={yMin} onChange={(event) => setYMin(event.target.value)} />
              <TextField size="small" type="number" label="Y max" value={yMax} onChange={(event) => setYMax(event.target.value)} />
            </Stack>
          )}

          <Typography className={styles.metricHint}>{metric.note} Единицы измерения: {unit}.</Typography>
          <Divider sx={{ my: 1.4 }} />

          <div className={styles.chartContainer}>
            {isEmpty ? (
              <div className={styles.emptyChart}><Typography variant="body2" color="text.secondary">Нет данных для выбранных фильтров.</Typography></div>
            ) : (
              <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} role="img" aria-label="Статистический график">
                {showGrid && tickValues.map((tick) => <line key={`grid-${tick}`} x1={left} y1={yAt(tick)} x2={left + innerW} y2={yAt(tick)} className={styles.gridLine} />)}
                <line x1={left} y1={top + innerH} x2={left + innerW} y2={top + innerH} className={styles.axisLine} />
                <line x1={left} y1={top} x2={left} y2={top + innerH} className={styles.axisLine} />
                {tickValues.map((tick) => <g key={`tick-${tick}`}><line x1={left - 5} y1={yAt(tick)} x2={left} y2={yAt(tick)} className={styles.tickLine} /><text x={left - 10} y={yAt(tick) + 4} className={styles.tickLabel} textAnchor="end">{format(tick)}</text></g>)}

                {chartType !== 'histogram' && prepared.timeline.map((point, index) => {
                  const step = Math.max(1, Math.ceil(prepared.timeline.length / 10));
                  if (index % step !== 0 && index !== prepared.timeline.length - 1) return null;
                  const x = xAt(index);
                  return <g key={`x-${point.timestamp}`}><line x1={x} y1={top + innerH} x2={x} y2={top + innerH + 5} className={styles.tickLine} /><text x={x} y={top + innerH + 20} className={styles.xLabel} textAnchor="middle">{point.label}</text></g>;
                })}

                {chartType === 'histogram' && hist.map((bin, index) => {
                  const step = innerW / Math.max(hist.length, 1);
                  const barW = step * 0.78;
                  const x = left + index * step + (step - barW) / 2;
                  const y = yAt(bin.count);
                  return <rect key={`hist-${index}`} x={x} y={Math.min(y, yAt(0))} width={barW} height={Math.max(1, yAt(0) - y)} className={styles.histBar} />;
                })}

                {(chartType === 'line' || chartType === 'area') && prepared.series.map((series) => {
                  if (!series.points.length) return null;
                  const path = series.points.map((point, index) => {
                    const idx = timelineIndex.get(point.timestamp);
                    if (idx === undefined) return '';
                    const x = xAt(idx);
                    const y = yAt(point.value);
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).filter(Boolean).join(' ');
                  if (!path) return null;
                  const firstIdx = timelineIndex.get(series.points[0].timestamp);
                  const lastIdx = timelineIndex.get(series.points[series.points.length - 1].timestamp);
                  const baseY = yAt(domain[0] <= 0 && domain[1] >= 0 ? 0 : domain[0]);
                  const areaPath = firstIdx !== undefined && lastIdx !== undefined ? `${path} L ${xAt(lastIdx)} ${baseY} L ${xAt(firstIdx)} ${baseY} Z` : '';
                  return <g key={`series-${series.productId}`}>{chartType === 'area' && areaPath && <path d={areaPath} fill={series.color} fillOpacity={0.2} stroke="none" />}<path d={path} fill="none" stroke={series.color} strokeWidth={2.3} />{showPoints && series.points.map((point) => { const idx = timelineIndex.get(point.timestamp); if (idx === undefined) return null; return <circle key={`point-${series.productId}-${point.timestamp}`} cx={xAt(idx)} cy={yAt(point.value)} r={3.2} fill={series.color} />; })}</g>;
                })}

                {chartType === 'bar' && prepared.timeline.map((point, index) => {
                  const centerX = xAt(index);
                  const step = prepared.timeline.length <= 1 ? innerW : innerW / (prepared.timeline.length - 1);
                  const groupW = Math.max(12, Math.min(96, step * 0.78));
                  const barW = Math.max(6, groupW / Math.max(valuesByProduct.length, 1));
                  if (stackBars) {
                    let pos = 0;
                    let neg = 0;
                    return valuesByProduct.map((item) => {
                      const value = item.values.get(point.timestamp);
                      if (value === undefined) return null;
                      const start = value >= 0 ? pos : neg;
                      const end = start + value;
                      if (value >= 0) pos = end; else neg = end;
                      return <rect key={`stack-${item.productId}-${point.timestamp}`} x={centerX - groupW / 2} y={Math.min(yAt(start), yAt(end))} width={Math.max(8, Math.min(72, step * 0.68))} height={Math.max(1, Math.abs(yAt(end) - yAt(start)))} fill={item.color} fillOpacity={0.84} />;
                    });
                  }
                  return valuesByProduct.map((item, productIndex) => {
                    const value = item.values.get(point.timestamp);
                    if (value === undefined) return null;
                    return <rect key={`bar-${item.productId}-${point.timestamp}`} x={centerX - groupW / 2 + productIndex * barW} y={Math.min(yAt(value), y0)} width={barW - 1} height={Math.max(1, Math.abs(y0 - yAt(value)))} fill={item.color} fillOpacity={0.85} />;
                  });
                })}

                <text x={left + innerW / 2} y={height - 8} className={styles.axisTitle} textAnchor="middle">{chartType === 'histogram' ? 'Диапазоны значений' : 'Временной интервал'}</text>
                <text x={20} y={top + innerH / 2} transform={`rotate(-90 20 ${top + innerH / 2})`} className={styles.axisTitle} textAnchor="middle">{chartType === 'histogram' ? 'Количество наблюдений' : `Значение (${unit})`}</text>
              </svg>
            )}

            {showLegend && chartType !== 'histogram' && (
              <div className={styles.legend}>
                {prepared.series.map((series) => <div key={`legend-${series.productId}`} className={styles.legendItem}><span className={styles.legendColor} style={{ background: series.color }} /><span>{series.label}</span></div>)}
              </div>
            )}
          </div>
        </Box>
      )}

      {tab === 1 && (
        <Box className={styles.tabBody}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Агрегированные значения после применения фильтров, нормализации и сглаживания.</Typography>
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead><tr><th>Период</th>{products.map((productId) => <th key={`header-${productId}`}>{PRODUCT_LABELS[productId]}</th>)}</tr></thead>
              <tbody>
                {prepared.timeline.length === 0 ? (
                  <tr><td className={styles.emptyCell} colSpan={Math.max(2, products.length + 1)}>Нет данных для отображения</td></tr>
                ) : (
                  prepared.timeline.map((point) => (
                    <tr key={`row-${point.timestamp}`}>
                      <td>{point.label}</td>
                      {products.map((productId) => {
                        const value = valuesByProduct.find((item) => item.productId === productId)?.values.get(point.timestamp);
                        return <td key={`value-${point.timestamp}-${productId}`}>{value === undefined ? '—' : format(value)}</td>;
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Box>
      )}
    </Paper>
  );
};

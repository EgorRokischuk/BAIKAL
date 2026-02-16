export const toDms = (decimalDegrees: number, isLng: boolean): string => {
  const direction = decimalDegrees < 0 ? (isLng ? 'W' : 'S') : isLng ? 'E' : 'N';
  const abs = Math.abs(decimalDegrees);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(2);

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};

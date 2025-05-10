export const convertLocation = (decimalDegrees: number, isLng: boolean): string => {
	const direction = decimalDegrees < 0 ? (isLng ? 'з' : 'ю') : isLng ? 'в' : 'с';

	const absoluteDegrees = Math.abs(decimalDegrees);
	const degrees = absoluteDegrees | 0;

	const fractionalPart = absoluteDegrees - degrees;
	const minutes = (fractionalPart * 60) | 0;
	const seconds = fractionalPart * 3600 - minutes * 60;
	const roundedSeconds = Math.round(seconds * 100) / 100;

	return `${degrees}° ${minutes}' ${roundedSeconds}" ${direction}.${isLng ? 'д' : 'ш'}.`;
};

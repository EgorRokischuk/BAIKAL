const sanitizeDigits = (value: string) => value.replace(/\D/g, '');

export const formatRuPhoneInput = (raw: string): string => {
  const digits = sanitizeDigits(raw);

  if (!digits) {
    return '';
  }

  let normalized = digits;

  if (normalized.startsWith('8')) {
    normalized = `7${normalized.slice(1)}`;
  } else if (normalized.startsWith('9')) {
    normalized = `7${normalized}`;
  }

  normalized = normalized.slice(0, 11);

  const country = normalized.slice(0, 1);
  const area = normalized.slice(1, 4);
  const prefix = normalized.slice(4, 7);
  const part1 = normalized.slice(7, 9);
  const part2 = normalized.slice(9, 11);

  let result = `+${country}`;

  if (area) {
    result += ` (${area}`;
    if (area.length === 3) {
      result += ')';
    }
  }

  if (prefix) {
    result += ` ${prefix}`;
  }

  if (part1) {
    result += ` - ${part1}`;
  }

  if (part2) {
    result += ` - ${part2}`;
  }

  return result;
};

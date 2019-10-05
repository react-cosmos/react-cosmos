// Chrome colors (neutral)

export const grey8 = createGreyColor(8);
export const grey24 = createGreyColor(24);
export const grey32 = createGreyColor(32);
export const grey64 = createGreyColor(64);
export const grey128 = createGreyColor(128);
export const grey160 = createGreyColor(160);
export const grey144 = createGreyColor(144);
export const grey176 = createGreyColor(176);
export const grey192 = createGreyColor(192);
export const grey208 = createGreyColor(208);
export const grey216 = createGreyColor(216);
export const grey224 = createGreyColor(224);
export const grey248 = createGreyColor(248);

export const black70 = createGreyColor(0, 0.7);

export const white3 = createGreyColor(255, 0.03);
export const white10 = createGreyColor(255, 0.1);
export const white20 = createGreyColor(255, 0.2);
export const white95 = createGreyColor(255, 0.95);

export const blue = '#3182ce';
export const lightBlue = '#63b3ed';

// Screen colors

export const deprecated_grey1 = 'hsl(230, 21%, 16%)';
export const deprecated_grey2 = 'hsl(230, 17%, 30%)';
export const deprecated_grey3 = 'hsl(230, 12%, 49%)';
export const deprecated_grey4 = 'hsl(230, 25%, 74%)';
export const deprecated_grey5 = 'hsl(230, 32%, 85%)';
export const deprecated_grey6 = 'hsl(230, 25%, 91%)';

export const deprecated_primary2 = 'hsl(230, 54%, 32%)';
export const deprecated_primary3 = 'hsl(230, 51%, 43%)';
export const deprecated_primary4 = 'hsl(230, 65%, 63%)';

export function selectedColors(defaultColor: string, selectedColor: string) {
  return (props: { selected?: boolean }) =>
    props.selected ? selectedColor : defaultColor;
}

export function disabledColors(defaultColor: string, disabledColor: string) {
  return (props: { disabled?: boolean }) =>
    props.disabled ? disabledColor : defaultColor;
}

function createGreyColor(intensity: number, alpha: number = 1) {
  return alpha !== 1
    ? `rgba(${intensity}, ${intensity}, ${intensity}, ${alpha})`
    : `rgb(${intensity}, ${intensity}, ${intensity})`;
}

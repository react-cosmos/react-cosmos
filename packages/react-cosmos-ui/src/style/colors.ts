// Chrome colors (neutral)

export const grey8 = createGreyColor(8);
export const grey24 = createGreyColor(24);
export const grey32 = createGreyColor(32);
export const grey64 = createGreyColor(64);
export const grey96 = createGreyColor(96);
export const grey128 = createGreyColor(128);
export const grey160 = createGreyColor(160);
export const grey144 = createGreyColor(144);
export const grey176 = createGreyColor(176);
export const grey192 = createGreyColor(192);
export const grey208 = createGreyColor(208);
export const grey216 = createGreyColor(216);
export const grey224 = createGreyColor(224);
export const grey248 = createGreyColor(248);

export const black60 = createGreyColor(0, 0.6);

export const white3 = createGreyColor(255, 0.03);
export const white10 = createGreyColor(255, 0.1);
export const white20 = createGreyColor(255, 0.2);
export const white95 = createGreyColor(255, 0.95);

export const blue = '#3182ce';
export const lightBlue = '#63b3ed';

// Screen colors

export const screenGrey1 = 'hsl(230, 17%, 22%)';
export const screenGrey2 = 'hsl(230, 19%, 33%)';
export const screenGrey3 = 'hsl(230, 22%, 49%)';
export const screenGrey4 = 'hsl(230, 25%, 74%)';
export const screenGrey5 = 'hsl(230, 28%, 85%)';
export const screenGrey6 = 'hsl(230, 32%, 93%)';

export const screenPrimary1 = 'hsl(230, 48%, 32%)';
export const screenPrimary2 = 'hsl(230, 51%, 43%)';
export const screenPrimary3 = 'hsl(230, 65%, 61%)';

export function selectedColors(defaultColor: string, selectedColor: string) {
  return (props: { selected?: boolean }) =>
    props.selected ? selectedColor : defaultColor;
}

export function disabledColors(defaultColor: string, disabledColor: string) {
  return (props: { disabled?: boolean }) =>
    props.disabled ? disabledColor : defaultColor;
}

export function createGreyColor(intensity: number, alpha: number = 1) {
  return alpha !== 1
    ? `rgba(${intensity}, ${intensity}, ${intensity}, ${alpha})`
    : `rgb(${intensity}, ${intensity}, ${intensity})`;
}

// Patterns

export const rendererBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23f1f1f1' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

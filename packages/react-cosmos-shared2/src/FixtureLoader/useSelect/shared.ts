export type UseSelectOptions = Record<string, unknown>;

export type UseSelectArgs<O extends UseSelectOptions> = {
  defaultValue: keyof O;
  options: O;
};

export type SetSelectValue<O extends UseSelectOptions> = (
  value: keyof O
) => void;

export type UseSelectOptions = Record<string, unknown>;

export type UseSelectArgs<Options extends UseSelectOptions> = {
  defaultValue: keyof Options;
  options: Options;
};

export type SetSelectValue<Options extends UseSelectOptions> = (
  value: keyof Options
) => void;

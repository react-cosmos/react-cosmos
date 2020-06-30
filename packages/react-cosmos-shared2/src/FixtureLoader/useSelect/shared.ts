export type UseSelectOptions<Option extends string> =
  | Option[]
  | Record<Option, unknown>;

export type UseSelectArgs<Option extends string> = {
  options: UseSelectOptions<Option>;
  defaultValue?: Option;
};

export type SetSelectValue<Option extends string> = (value: Option) => void;

export function getNormalizedSelectOptions<Option extends string>(
  options: UseSelectOptions<Option>
): Option[] {
  return Array.isArray(options) ? options : (Object.keys(options) as Option[]);
}

export function getDefaultSelectValue<Option extends string>({
  options,
  defaultValue,
}: UseSelectArgs<Option>): Option {
  return typeof defaultValue === 'string'
    ? defaultValue
    : getNormalizedSelectOptions(options)[0];
}

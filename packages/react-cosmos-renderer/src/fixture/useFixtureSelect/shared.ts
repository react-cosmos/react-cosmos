type GroupedOptions<Option extends string> = {
  group: string;
  options: Option[];
};

export type UseSelectArgs<Option extends string> = {
  options: Option[] | GroupedOptions<Option>[];
  defaultValue?: Option;
};

export type SetSelectValue<Option extends string> = (value: Option) => void;

export function getDefaultSelectValue<Option extends string>({
  options,
  defaultValue,
}: UseSelectArgs<Option>): Option {
  if (typeof defaultValue === 'string') {
    return defaultValue;
  }

  const [firstOption] = options;

  if (typeof firstOption === 'object') {
    return firstOption.options[0];
  }

  return firstOption;
}

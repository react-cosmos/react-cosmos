export type GroupedOptions<Option> = {
  group: string;
  options: Option[];
};

export function isGroupedOptions<Option>(
  options: Option[] | GroupedOptions<Option>[]
): options is GroupedOptions<Option>[] {
  const [firstOption] = options;

  if (!firstOption) {
    return false;
  }

  if (typeof firstOption !== 'object') {
    return false;
  }

  return 'group' in firstOption;
}

export type UseSelectArgs<Option extends string> = {
  defaultValue: Option;
  options: Option[] | Record<Option, unknown>;
};

export type SetSelectValue<Option extends string> = (value: Option) => void;

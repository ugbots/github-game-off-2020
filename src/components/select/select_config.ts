export interface SelectConfig<T> {
  readonly options: readonly SelectOption<T>[];
}

export interface SelectOption<T> {
  readonly disabled?: boolean;
  readonly label: string;
  readonly value: T;
}

export const buildEmptySelectConfig = <T>(): SelectConfig<T> => ({
  options: [],
});

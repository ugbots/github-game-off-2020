export interface TabGroupConfig<T> {
  readonly tabs: readonly Tab<T>[];
}

export interface Tab<T> {
  readonly label: string;
  readonly isSelected: boolean;
  readonly value?: T;
}

export const buildEmptyTabGroupConfig = <T>(): TabGroupConfig<T> => ({
  tabs: [],
});

export const buildEmptyTab = <T>(): Tab<T> => ({
  label: '(unknown label)',
  isSelected: false,
  value: undefined,
});

export const selectTab = <T>(
  config: TabGroupConfig<T>,
  tab: Tab<T>,
): TabGroupConfig<T> => ({
  tabs: config.tabs.map((t) => ({
    ...t,
    isSelected: t === tab,
  })),
});

export const publishStatuses = [
  { value: 'IS_ONGOING', description: 'Онгоинг' },
  { value: 'IS_NOT_ONGOING', description: 'Завершено' },
] as const;

export const productionStatuses = [
  { value: 'IS_IN_PRODUCTION', description: 'В производстве' },
  { value: 'IS_NOT_IN_PRODUCTION', description: 'Не в производстве' },
] as const;

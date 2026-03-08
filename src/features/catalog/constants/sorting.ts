export const sortingOptions = [
  { value: 'FRESH_AT_DESC', description: 'Новые первыми' },
  { value: 'FRESH_AT_ASC', description: 'Старые первыми' },
  { value: 'RATING_DESC', description: 'По рейтингу ↓' },
  { value: 'RATING_ASC', description: 'По рейтингу ↑' },
  { value: 'YEAR_DESC', description: 'По году ↓' },
  { value: 'YEAR_ASC', description: 'По году ↑' },
] as const;

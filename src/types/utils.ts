export type PrismaNullable<T> = {
  [P in keyof T]: T[P] extends infer U | null ? U | undefined : T[P];
};

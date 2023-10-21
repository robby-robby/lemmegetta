export function filterFirst<T>(list: T[], fn: (item: T) => boolean): T[] {
  return list.filter(
    (item, index) => !fn(item) || index !== list.findIndex(fn)
  );
}

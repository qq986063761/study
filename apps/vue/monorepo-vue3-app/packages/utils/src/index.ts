export type MaybeArray<T> = T | T[]

export function toArray<T>(value: MaybeArray<T> | null | undefined): T[] {
  if (value == null) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError('min must be less than or equal to max')
  }

  return Math.min(Math.max(value, min), max)
}

export function capitalize(value: string): string {
  if (value.length === 0) {
    return value
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatNumber(value: number, locale = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatDateTime(
  value: Date | number | string,
  locale = 'zh-CN',
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
  },
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value))
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

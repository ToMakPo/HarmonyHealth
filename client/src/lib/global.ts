export function getOrdinalSuffix(day: number, locale: string = 'en-US'): string {
	const rules = new Intl.PluralRules(locale, { type: 'ordinal' })
	const suffixMap: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' }
	return suffixMap[rules.select(day)]
}

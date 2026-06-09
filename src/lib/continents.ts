const COUNTRY_CONTINENT: Record<string, string> = {
  // South America
  'argentina': 'South America',
  'brazil': 'South America',
  'chile': 'South America',
  'colombia': 'South America',
  'ecuador': 'South America',
  'paraguay': 'South America',
  'peru': 'South America',
  'uruguay': 'South America',
  'venezuela': 'South America',
  'bolivia': 'South America',
  // Europe
  'england': 'Europe',
  'france': 'Europe',
  'germany': 'Europe',
  'spain': 'Europe',
  'italy': 'Europe',
  'portugal': 'Europe',
  'netherlands': 'Europe',
  'belgium': 'Europe',
  'croatia': 'Europe',
  'denmark': 'Europe',
  'switzerland': 'Europe',
  'austria': 'Europe',
  'sweden': 'Europe',
  'norway': 'Europe',
  'poland': 'Europe',
  'czech republic': 'Europe',
  'czechia': 'Europe',
  'scotland': 'Europe',
  'wales': 'Europe',
  'ireland': 'Europe',
  'serbia': 'Europe',
  'turkey': 'Europe',
  'ukraine': 'Europe',
  'hungary': 'Europe',
  'greece': 'Europe',
  'romania': 'Europe',
  'finland': 'Europe',
  'iceland': 'Europe',
  'slovakia': 'Europe',
  'slovenia': 'Europe',
  'bosnia': 'Europe',
  'bosnia and herzegovina': 'Europe',
  'albania': 'Europe',
  'north macedonia': 'Europe',
  'montenegro': 'Europe',
  'georgia': 'Europe',
  'kosovo': 'Europe',
  // Africa
  'nigeria': 'Africa',
  'senegal': 'Africa',
  'cameroon': 'Africa',
  'ghana': 'Africa',
  'ivory coast': 'Africa',
  'egypt': 'Africa',
  'morocco': 'Africa',
  'algeria': 'Africa',
  'tunisia': 'Africa',
  'south africa': 'Africa',
  'mali': 'Africa',
  'congo': 'Africa',
  'dr congo': 'Africa',
  'congo dr': 'Africa',
  'cabo verde': 'Africa',
  'burkina faso': 'Africa',
  'guinea': 'Africa',
  'mozambique': 'Africa',
  'zambia': 'Africa',
  'zimbabwe': 'Africa',
  'kenya': 'Africa',
  'tanzania': 'Africa',
  'uganda': 'Africa',
  'angola': 'Africa',
  'ethiopia': 'Africa',
  // Asia & Oceania
  'japan': 'Asia & Oceania',
  'south korea': 'Asia & Oceania',
  'australia': 'Asia & Oceania',
  'new zealand': 'Asia & Oceania',
  'china': 'Asia & Oceania',
  'uae': 'Asia & Oceania',
  'uzbekistan': 'Asia & Oceania',
  'india': 'Asia & Oceania',
  'thailand': 'Asia & Oceania',
  'vietnam': 'Asia & Oceania',
  'indonesia': 'Asia & Oceania',
  'malaysia': 'Asia & Oceania',
  // Middle East
  'iran': 'Middle East',
  'iraq': 'Middle East',
  'jordan': 'Middle East',
  'saudi arabia': 'Middle East',
  'qatar': 'Middle East',
  'oman': 'Middle East',
  'bahrain': 'Middle East',
  'kuwait': 'Middle East',
  'palestine': 'Middle East',
  'syria': 'Middle East',
  'lebanon': 'Middle East',
  // North & Central America
  'usa': 'North & Central America',
  'mexico': 'North & Central America',
  'canada': 'North & Central America',
  'costa rica': 'North & Central America',
  'panama': 'North & Central America',
  'honduras': 'North & Central America',
  'jamaica': 'North & Central America',
  'el salvador': 'North & Central America',
  'guatemala': 'North & Central America',
  'trinidad and tobago': 'North & Central America',
  'haiti': 'North & Central America',
  'curacao': 'North & Central America',
  'nicaragua': 'North & Central America',
}

export function getAvailableContinents(countries: string[]): string[] {
  const lower = countries.map(c => c.toLowerCase())
  const continents = new Set<string>()
  for (const country of lower) {
    const continent = COUNTRY_CONTINENT[country]
    if (continent) continents.add(continent)
  }
  return Array.from(continents)
}

export function getCountriesInContinent(continent: string, availableCountries: string[]): string[] {
  const lower = availableCountries.map(c => c.toLowerCase())
  return lower.filter(c => COUNTRY_CONTINENT[c] === continent).sort()
}

export function formatCountryName(country: string): string {
  const special: Record<string, string> = {
    'usa': 'USA',
    'uae': 'UAE',
    'uk': 'UK',
    'dr congo': 'DR Congo',
  }
  if (special[country.toLowerCase()]) return special[country.toLowerCase()]
  return country
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const CONTINENT_MAP: Record<string, string[]> = {
  'South America': [
    'argentina', 'brazil', 'chile', 'colombia', 'ecuador', 'paraguay',
    'peru', 'uruguay', 'venezuela', 'bolivia',
  ],
  'Europe': [
    'england', 'france', 'germany', 'spain', 'italy', 'portugal',
    'netherlands', 'belgium', 'croatia', 'denmark', 'switzerland',
    'austria', 'sweden', 'norway', 'poland', 'czech republic',
    'scotland', 'wales', 'ireland', 'serbia', 'turkey', 'ukraine',
    'hungary', 'greece', 'romania', 'finland', 'iceland', 'slovakia',
    'slovenia', 'bosnia', 'albania', 'north macedonia', 'montenegro',
    'georgia', 'kosovo',
  ],
  'Africa': [
    'nigeria', 'senegal', 'cameroon', 'ghana', 'ivory coast', 'egypt',
    'morocco', 'algeria', 'tunisia', 'south africa', 'mali', 'congo',
    'dr congo', 'burkina faso', 'guinea', 'mozambique', 'zambia',
    'zimbabwe', 'kenya', 'tanzania', 'uganda', 'angola', 'ethiopia',
  ],
  'Asia': [
    'japan', 'south korea', 'saudi arabia', 'iran', 'australia',
    'china', 'qatar', 'uae', 'iraq', 'uzbekistan', 'india',
    'thailand', 'vietnam', 'indonesia', 'malaysia', 'jordan',
    'oman', 'bahrain', 'kuwait', 'palestine', 'syria', 'lebanon',
  ],
  'North America': [
    'usa', 'mexico', 'canada', 'costa rica', 'panama', 'honduras',
    'jamaica', 'el salvador', 'guatemala', 'trinidad and tobago',
    'haiti', 'curacao', 'nicaragua',
  ],
}

export function getAvailableContinents(countries: string[]): string[] {
  const lower = countries.map(c => c.toLowerCase())
  return Object.keys(CONTINENT_MAP).filter(continent =>
    CONTINENT_MAP[continent].some(c => lower.includes(c))
  )
}

export function getCountriesInContinent(continent: string, availableCountries: string[]): string[] {
  const continentCountries = CONTINENT_MAP[continent] ?? []
  const lower = availableCountries.map(c => c.toLowerCase())
  return continentCountries.filter(c => lower.includes(c)).sort()
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

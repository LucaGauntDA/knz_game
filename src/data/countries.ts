export interface CountryInfo {
  oval: string;
  code: string;
  nameDe: string;
}

export const COUNTRIES: CountryInfo[] = [
  // Existing countries
  { oval: 'D', code: 'DE', nameDe: 'Deutschland' },
  { oval: 'A', code: 'AT', nameDe: 'Österreich' },
  { oval: 'CH', code: 'CH', nameDe: 'Schweiz' },
  { oval: 'I', code: 'IT', nameDe: 'Italien' },
  { oval: 'F', code: 'FR', nameDe: 'Frankreich' },
  { oval: 'NL', code: 'NL', nameDe: 'Niederlande' },
  { oval: 'B', code: 'BE', nameDe: 'Belgien' },
  { oval: 'DK', code: 'DK', nameDe: 'Dänemark' },
  { oval: 'S', code: 'SE', nameDe: 'Schweden' },
  { oval: 'PL', code: 'PL', nameDe: 'Polen' },
  { oval: 'CZ', code: 'CZ', nameDe: 'Tschechien' },
  { oval: 'SK', code: 'SK', nameDe: 'Slowakei' },
  { oval: 'SLO', code: 'SI', nameDe: 'Slowenien' },
  { oval: 'HR', code: 'HR', nameDe: 'Kroatien' },
  { oval: 'SRB', code: 'RS', nameDe: 'Serbien' },
  { oval: 'H', code: 'HU', nameDe: 'Ungarn' },
  { oval: 'RO', code: 'RO', nameDe: 'Rumänien' },
  { oval: 'GR', code: 'GR', nameDe: 'Griechenland' },
  { oval: 'TR', code: 'TR', nameDe: 'Türkei' },
  { oval: 'E', code: 'ES', nameDe: 'Spanien' },
  { oval: 'FIN', code: 'FI', nameDe: 'Finnland' },
  { oval: 'RKS', code: 'XK', nameDe: 'Kosovo' },

  // Newly requested country support
  { oval: 'BG', code: 'BG', nameDe: 'Bulgarien' },
  { oval: 'BIH', code: 'BA', nameDe: 'Bosnien & Herzegowina' },
  { oval: 'CHN', code: 'CN', nameDe: 'China' },
  { oval: 'CY', code: 'CY', nameDe: 'Zypern' },
  { oval: 'FL', code: 'LI', nameDe: 'Liechtenstein' },
  { oval: 'IRL', code: 'IE', nameDe: 'Irland' },
  { oval: 'L', code: 'LU', nameDe: 'Luxemburg' },
  { oval: 'LAR', code: 'LY', nameDe: 'Libyen' },
  { oval: 'LT', code: 'LT', nameDe: 'Litauen' },
  { oval: 'LV', code: 'LV', nameDe: 'Lettland' },
  { oval: 'M', code: 'MT', nameDe: 'Malta' },
  { oval: 'MA', code: 'MA', nameDe: 'Marokko' },
  { oval: 'MD', code: 'MD', nameDe: 'Moldau' },
  { oval: 'N', code: 'NO', nameDe: 'Norwegen' },
  { oval: 'NMK', code: 'MK', nameDe: 'Nordmazedonien' },
  { oval: 'OM', code: 'OM', nameDe: 'Oman' },
  { oval: 'P', code: 'PT', nameDe: 'Portugal' },
  { oval: 'TN', code: 'TN', nameDe: 'Tunesien' },
  { oval: 'UA', code: 'UA', nameDe: 'Ukraine' },
  { oval: 'UAE', code: 'AE', nameDe: 'Ver. Arab. Emirate' },
  { oval: 'UK', code: 'GB', nameDe: 'Großbritannien' },
  { oval: 'GB', code: 'GB', nameDe: 'Großbritannien' },
  { oval: 'UZ', code: 'UZ', nameDe: 'Usbekistan' },

  // New additions: Nigeria, Israel, Libanon, Südkorea, Kasachstan, Iran, Singapur
  { oval: 'NGR', code: 'NG', nameDe: 'Nigeria' },
  { oval: 'IL', code: 'IL', nameDe: 'Israel' },
  { oval: 'RL', code: 'LB', nameDe: 'Libanon' },
  { oval: 'ROK', code: 'KR', nameDe: 'Südkorea' },
  { oval: 'KZ', code: 'KZ', nameDe: 'Kasachstan' },
  { oval: 'IR', code: 'IR', nameDe: 'Iran' },
  { oval: 'SGP', code: 'SG', nameDe: 'Singapur' },

  // Other European / neighbouring countries
  { oval: 'AL', code: 'AL', nameDe: 'Albanien' },
  { oval: 'EST', code: 'EE', nameDe: 'Estland' },
  { oval: 'MNE', code: 'ME', nameDe: 'Montenegro' },
  { oval: 'IS', code: 'IS', nameDe: 'Island' },
];

export const COUNTRY_BY_OVAL: Record<string, CountryInfo> = Object.fromEntries(
  COUNTRIES.map((c) => [c.oval, c])
);

export interface CountryInfo {
  oval: string;
  code: string;
  nameDe: string;
}

export const COUNTRIES: CountryInfo[] = [
  { oval: 'RKS', code: 'XK', nameDe: 'Kosovo' },
  { oval: 'D', code: 'DE', nameDe: 'Deutschland' },
  { oval: 'A', code: 'AT', nameDe: 'Österreich' },
  { oval: 'CH', code: 'CH', nameDe: 'Schweiz' },
  { oval: 'F', code: 'FR', nameDe: 'Frankreich' },
  { oval: 'I', code: 'IT', nameDe: 'Italien' },
  { oval: 'NL', code: 'NL', nameDe: 'Niederlande' },
  { oval: 'PL', code: 'PL', nameDe: 'Polen' },
  { oval: 'CZ', code: 'CZ', nameDe: 'Tschechien' },
  { oval: 'E', code: 'ES', nameDe: 'Spanien' },
  { oval: 'GB', code: 'GB', nameDe: 'Großbritannien' },
  { oval: 'AL', code: 'AL', nameDe: 'Albanien' },
  { oval: 'HR', code: 'HR', nameDe: 'Kroatien' },
  { oval: 'S', code: 'SE', nameDe: 'Schweden' },
  { oval: 'DK', code: 'DK', nameDe: 'Dänemark' },
  { oval: 'B', code: 'BE', nameDe: 'Belgien' },
  { oval: 'GR', code: 'GR', nameDe: 'Griechenland' },
  { oval: 'N', code: 'NO', nameDe: 'Norwegen' },
  { oval: 'FIN', code: 'FI', nameDe: 'Finnland' },
  { oval: 'IRL', code: 'IE', nameDe: 'Irland' },
  { oval: 'P', code: 'PT', nameDe: 'Portugal' },
  { oval: 'H', code: 'HU', nameDe: 'Ungarn' },
  { oval: 'RO', code: 'RO', nameDe: 'Rumänien' },
  { oval: 'BG', code: 'BG', nameDe: 'Bulgarien' },
  { oval: 'SK', code: 'SK', nameDe: 'Slowakei' },
  { oval: 'SLO', code: 'SI', nameDe: 'Slowenien' },
  { oval: 'EST', code: 'EE', nameDe: 'Estland' },
  { oval: 'LV', code: 'LV', nameDe: 'Lettland' },
  { oval: 'LT', code: 'LT', nameDe: 'Litauen' },
  { oval: 'BIH', code: 'BA', nameDe: 'Bosnien & Herzegowina' },
  { oval: 'SRB', code: 'RS', nameDe: 'Serbien' },
  { oval: 'MNE', code: 'ME', nameDe: 'Montenegro' },
  { oval: 'NMK', code: 'MK', nameDe: 'Nordmazedonien' },
  { oval: 'IS', code: 'IS', nameDe: 'Island' },
  { oval: 'TR', code: 'TR', nameDe: 'Türkei' },
  { oval: 'UA', code: 'UA', nameDe: 'Ukraine' },
  { oval: 'L', code: 'LU', nameDe: 'Luxemburg' },
];

export const COUNTRY_BY_OVAL: Record<string, CountryInfo> = Object.fromEntries(
  COUNTRIES.map((c) => [c.oval, c])
);

import { Continent, Confederation } from '../types/game';

export interface NationInfo {
  name: string;
  code: string;
  flag: string;
  continent: Continent;
  confederation: Confederation;
}

export interface ConfederationMetadata {
  code: Confederation;
  fullName: string;
  regionName: string;
  lowestLicenseName: string;
  lowestLicenseBadge: string;
  lowestLicenseDesc: string;
  licenseTiers: string[];
  themeColor: string;
  bannerGradient: string;
  governingBodyMotto: string;
}

export const CONFEDERATION_METADATA: Record<Confederation, ConfederationMetadata> = {
  UEFA: {
    code: 'UEFA',
    fullName: 'Union of European Football Associations',
    regionName: 'Europe',
    lowestLicenseName: 'UEFA C License',
    lowestLicenseBadge: 'UEFA C',
    lowestLicenseDesc: 'Grassroots Foundation & Youth Player Development Certificate',
    licenseTiers: ['UEFA C License', 'UEFA B License', 'UEFA A License', 'UEFA Pro Licence'],
    themeColor: '#1d4ed8', // blue-700
    bannerGradient: 'from-blue-900 via-indigo-900 to-slate-900',
    governingBodyMotto: 'Respect • Equal Game • European Football Excellence',
  },
  AFC: {
    code: 'AFC',
    fullName: 'Asian Football Confederation',
    regionName: 'Asia & Australia',
    lowestLicenseName: 'AFC C License',
    lowestLicenseBadge: 'AFC C',
    lowestLicenseDesc: 'Grassroots Coaching Foundation & Youth Development Certificate',
    licenseTiers: ['AFC C License', 'AFC B License', 'AFC A License', 'AFC Pro Diploma'],
    themeColor: '#d97706', // amber-600
    bannerGradient: 'from-amber-950 via-yellow-900 to-slate-900',
    governingBodyMotto: 'One Asia, One Goal • The Future is Asia',
  },
  CONMEBOL: {
    code: 'CONMEBOL',
    fullName: 'Confederación Sudamericana de Fútbol',
    regionName: 'South America',
    lowestLicenseName: 'CONMEBOL Licencia B',
    lowestLicenseBadge: 'CONMEBOL B',
    lowestLicenseDesc: 'Iniciación y Fútbol Base - Certificación Oficial de Entrenador',
    licenseTiers: ['CONMEBOL Licencia B', 'CONMEBOL Licencia A', 'CONMEBOL Licencia PRO'],
    themeColor: '#0284c7', // sky-600
    bannerGradient: 'from-sky-950 via-blue-900 to-slate-900',
    governingBodyMotto: 'Cree En Grande • La Pasión del Fútbol Sudamericano',
  },
  CONCACAF: {
    code: 'CONCACAF',
    fullName: 'Confederation of North, Central America and Caribbean Association Football',
    regionName: 'North & Central America & Caribbean',
    lowestLicenseName: 'CONCACAF C License',
    lowestLicenseBadge: 'CONCACAF C',
    lowestLicenseDesc: 'Foundational Coaching & Youth Tactical Readiness License',
    licenseTiers: ['CONCACAF C License', 'CONCACAF B License', 'CONCACAF A License', 'CONCACAF Pro'],
    themeColor: '#dc2626', // red-600
    bannerGradient: 'from-red-950 via-rose-900 to-slate-900',
    governingBodyMotto: 'Love For Our Game • Unity, Passion, Development',
  },
  CAF: {
    code: 'CAF',
    fullName: 'Confédération Africaine de Football',
    regionName: 'Africa',
    lowestLicenseName: 'CAF C License',
    lowestLicenseBadge: 'CAF C',
    lowestLicenseDesc: 'Basic Coaching Principles & Grassroots Academy Certificate',
    licenseTiers: ['CAF C License', 'CAF B License', 'CAF A License', 'CAF Pro License'],
    themeColor: '#059669', // emerald-600
    bannerGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    governingBodyMotto: 'African Football Spirit • Passion, Talent, Unity',
  },
  OFC: {
    code: 'OFC',
    fullName: 'Oceania Football Confederation',
    regionName: 'Oceania & Pacific Islands',
    lowestLicenseName: 'OFC C License',
    lowestLicenseBadge: 'OFC C',
    lowestLicenseDesc: 'Junior Development & Grassroots Community Coaching Badge',
    licenseTiers: ['OFC C License', 'OFC B License', 'OFC A License', 'OFC Pro'],
    themeColor: '#0ea5e9', // cyan-500
    bannerGradient: 'from-cyan-950 via-sky-900 to-slate-900',
    governingBodyMotto: 'Football for All Across the Pacific • Developing the Future',
  },
};

export const WORLD_NATIONS: NationInfo[] = [
  // --- EUROPE (UEFA) ---
  { name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Scotland', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Wales', code: 'WAL', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Northern Ireland', code: 'NIR', flag: '🇬🇧', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Spain', code: 'ESP', flag: '🇪🇸', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Germany', code: 'GER', flag: '🇩🇪', continent: 'Europe', confederation: 'UEFA' },
  { name: 'France', code: 'FRA', flag: '🇫🇷', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Italy', code: 'ITA', flag: '🇮🇹', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Portugal', code: 'POR', flag: '🇵🇹', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Netherlands', code: 'NED', flag: '🇳🇱', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Belgium', code: 'BEL', flag: '🇧🇪', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Croatia', code: 'CRO', flag: '🇭🇷', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Denmark', code: 'DEN', flag: '🇩🇰', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Sweden', code: 'SWE', flag: '🇸🇪', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Norway', code: 'NOR', flag: '🇳🇴', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Switzerland', code: 'SUI', flag: '🇨🇭', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Austria', code: 'AUT', flag: '🇦🇹', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Poland', code: 'POL', flag: '🇵🇱', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Ukraine', code: 'UKR', flag: '🇺🇦', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Turkey', code: 'TUR', flag: '🇹🇷', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Greece', code: 'GRE', flag: '🇬🇷', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Serbia', code: 'SRB', flag: '🇷🇸', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Czech Republic', code: 'CZE', flag: '🇨🇿', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Ireland', code: 'IRL', flag: '🇮🇪', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Romania', code: 'ROU', flag: '🇷🇴', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Hungary', code: 'HUN', flag: '🇭🇺', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Finland', code: 'FIN', flag: '🇫🇮', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Slovakia', code: 'SVK', flag: '🇸🇰', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Bulgaria', code: 'BUL', flag: '🇧🇬', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Iceland', code: 'ISL', flag: '🇮🇸', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Bosnia and Herzegovina', code: 'BIH', flag: '🇧🇦', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Slovenia', code: 'SVN', flag: '🇸🇮', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Albania', code: 'ALB', flag: '🇦🇱', continent: 'Europe', confederation: 'UEFA' },
  { name: 'North Macedonia', code: 'MKD', flag: '🇲🇰', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Montenegro', code: 'MNE', flag: '🇲🇪', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Luxembourg', code: 'LUX', flag: '🇱🇺', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Cyprus', code: 'CYP', flag: '🇨🇾', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Malta', code: 'MLT', flag: '🇲🇹', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Estonia', code: 'EST', flag: '🇪🇪', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Latvia', code: 'LVA', flag: '🇱🇻', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Lithuania', code: 'LTU', flag: '🇱🇹', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Georgia', code: 'GEO', flag: '🇬🇪', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Armenia', code: 'ARM', flag: '🇦🇲', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Azerbaijan', code: 'AZE', flag: '🇦🇿', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Kazakhstan', code: 'KAZ', flag: '🇰🇿', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Israel', code: 'ISR', flag: '🇮🇱', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Kosovo', code: 'KOS', flag: '🇽🇰', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Faroe Islands', code: 'FRO', flag: '🇫🇴', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Andorra', code: 'AND', flag: '🇦🇩', continent: 'Europe', confederation: 'UEFA' },
  { name: 'San Marino', code: 'SMR', flag: '🇸🇲', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Gibraltar', code: 'GIB', flag: '🇬🇮', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Liechtenstein', code: 'LIE', flag: '🇱🇮', continent: 'Europe', confederation: 'UEFA' },
  { name: 'Moldova', code: 'MDA', flag: '🇲🇩', continent: 'Europe', confederation: 'UEFA' },

  // --- ASIA (AFC) ---
  { name: 'Japan', code: 'JPN', flag: '🇯🇵', continent: 'Asia', confederation: 'AFC' },
  { name: 'South Korea', code: 'KOR', flag: '🇰🇷', continent: 'Asia', confederation: 'AFC' },
  { name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', continent: 'Asia', confederation: 'AFC' },
  { name: 'Australia', code: 'AUS', flag: '🇦🇺', continent: 'Asia', confederation: 'AFC' }, // Competes in AFC
  { name: 'Iran', code: 'IRN', flag: '🇮🇷', continent: 'Asia', confederation: 'AFC' },
  { name: 'Qatar', code: 'QAT', flag: '🇶🇦', continent: 'Asia', confederation: 'AFC' },
  { name: 'United Arab Emirates', code: 'UAE', flag: '🇦🇪', continent: 'Asia', confederation: 'AFC' },
  { name: 'China', code: 'CHN', flag: '🇨🇳', continent: 'Asia', confederation: 'AFC' },
  { name: 'India', code: 'IND', flag: '🇮🇳', continent: 'Asia', confederation: 'AFC' },
  { name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', continent: 'Asia', confederation: 'AFC' },
  { name: 'Iraq', code: 'IRQ', flag: '🇮🇶', continent: 'Asia', confederation: 'AFC' },
  { name: 'Jordan', code: 'JOR', flag: '🇯🇴', continent: 'Asia', confederation: 'AFC' },
  { name: 'Oman', code: 'OMA', flag: '🇴🇲', continent: 'Asia', confederation: 'AFC' },
  { name: 'Bahrain', code: 'BHR', flag: '🇧🇭', continent: 'Asia', confederation: 'AFC' },
  { name: 'Thailand', code: 'THA', flag: '🇹🇭', continent: 'Asia', confederation: 'AFC' },
  { name: 'Vietnam', code: 'VIE', flag: '🇻🇳', continent: 'Asia', confederation: 'AFC' },
  { name: 'Indonesia', code: 'IDN', flag: '🇮🇩', continent: 'Asia', confederation: 'AFC' },
  { name: 'Malaysia', code: 'MAS', flag: '🇲🇾', continent: 'Asia', confederation: 'AFC' },
  { name: 'Singapore', code: 'SGP', flag: '🇸🇬', continent: 'Asia', confederation: 'AFC' },
  { name: 'Philippines', code: 'PHI', flag: '🇵🇭', continent: 'Asia', confederation: 'AFC' },
  { name: 'Kuwait', code: 'KUW', flag: '🇰🇼', continent: 'Asia', confederation: 'AFC' },
  { name: 'Lebanon', code: 'LBN', flag: '🇱🇧', continent: 'Asia', confederation: 'AFC' },
  { name: 'Syria', code: 'SYR', flag: '🇸🇾', continent: 'Asia', confederation: 'AFC' },
  { name: 'Palestine', code: 'PLE', flag: '🇵🇸', continent: 'Asia', confederation: 'AFC' },
  { name: 'Kyrgyzstan', code: 'KGZ', flag: '🇰🇬', continent: 'Asia', confederation: 'AFC' },
  { name: 'Tajikistan', code: 'TJK', flag: '🇹🇯', continent: 'Asia', confederation: 'AFC' },
  { name: 'Turkmenistan', code: 'TKM', flag: '🇹🇲', continent: 'Asia', confederation: 'AFC' },
  { name: 'Hong Kong', code: 'HKG', flag: '🇭🇰', continent: 'Asia', confederation: 'AFC' },
  { name: 'Chinese Taipei (Taiwan)', code: 'TPE', flag: '🇹🇼', continent: 'Asia', confederation: 'AFC' },
  { name: 'Myanmar', code: 'MYA', flag: '🇲🇲', continent: 'Asia', confederation: 'AFC' },
  { name: 'Cambodia', code: 'CAM', flag: '🇰🇭', continent: 'Asia', confederation: 'AFC' },
  { name: 'Yemen', code: 'YEM', flag: '🇾🇪', continent: 'Asia', confederation: 'AFC' },
  { name: 'Afghanistan', code: 'AFG', flag: '🇦🇫', continent: 'Asia', confederation: 'AFC' },
  { name: 'Nepal', code: 'NEP', flag: '🇳🇵', continent: 'Asia', confederation: 'AFC' },
  { name: 'Bangladesh', code: 'BAN', flag: '🇧🇩', continent: 'Asia', confederation: 'AFC' },
  { name: 'Sri Lanka', code: 'SRI', flag: '🇱🇰', continent: 'Asia', confederation: 'AFC' },
  { name: 'Maldives', code: 'MDV', flag: '🇲🇻', continent: 'Asia', confederation: 'AFC' },
  { name: 'Mongolia', code: 'MNG', flag: '🇲🇳', continent: 'Asia', confederation: 'AFC' },
  { name: 'North Korea', code: 'PRK', flag: '🇰🇵', continent: 'Asia', confederation: 'AFC' },
  { name: 'Pakistan', code: 'PAK', flag: '🇵🇰', continent: 'Asia', confederation: 'AFC' },

  // --- SOUTH AMERICA (CONMEBOL) ---
  { name: 'Brazil', code: 'BRA', flag: '🇧🇷', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Argentina', code: 'ARG', flag: '🇦🇷', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Uruguay', code: 'URU', flag: '🇺🇾', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Colombia', code: 'COL', flag: '🇨🇴', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Chile', code: 'CHI', flag: '🇨🇱', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Ecuador', code: 'ECU', flag: '🇪🇨', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Paraguay', code: 'PAR', flag: '🇵🇾', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Peru', code: 'PER', flag: '🇵🇪', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Venezuela', code: 'VEN', flag: '🇻🇪', continent: 'South America', confederation: 'CONMEBOL' },
  { name: 'Bolivia', code: 'BOL', flag: '🇧🇴', continent: 'South America', confederation: 'CONMEBOL' },

  // --- NORTH & CENTRAL AMERICA & CARIBBEAN (CONCACAF) ---
  { name: 'United States', code: 'USA', flag: '🇺🇸', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Mexico', code: 'MEX', flag: '🇲🇽', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Canada', code: 'CAN', flag: '🇨🇦', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Costa Rica', code: 'CRC', flag: '🇨🇷', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Panama', code: 'PAN', flag: '🇵🇦', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Jamaica', code: 'JAM', flag: '🇯🇲', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Honduras', code: 'HON', flag: '🇭🇳', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'El Salvador', code: 'SLV', flag: '🇸🇻', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Trinidad and Tobago', code: 'TRI', flag: '🇹🇹', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Guatemala', code: 'GUA', flag: '🇬🇹', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Haiti', code: 'HAI', flag: '🇭🇹', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Curaçao', code: 'CUW', flag: '🇨🇼', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Cuba', code: 'CUB', flag: '🇨🇺', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Suriname', code: 'SUR', flag: '🇸🇷', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Nicaragua', code: 'NCA', flag: '🇳🇮', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Dominican Republic', code: 'DOM', flag: '🇩🇴', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Barbados', code: 'BRB', flag: '🇧🇧', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Bermuda', code: 'BER', flag: '🇧🇲', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Puerto Rico', code: 'PUR', flag: '🇵🇷', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Guyana', code: 'GUY', flag: '🇬🇾', continent: 'North America', confederation: 'CONCACAF' },
  { name: 'Belize', code: 'BLZ', flag: '🇧🇿', continent: 'North America', confederation: 'CONCACAF' },

  // --- AFRICA (CAF) ---
  { name: 'Nigeria', code: 'NGA', flag: '🇳🇬', continent: 'Africa', confederation: 'CAF' },
  { name: 'Senegal', code: 'SEN', flag: '🇸🇳', continent: 'Africa', confederation: 'CAF' },
  { name: 'Morocco', code: 'MAR', flag: '🇲🇦', continent: 'Africa', confederation: 'CAF' },
  { name: 'Egypt', code: 'EGY', flag: '🇪🇬', continent: 'Africa', confederation: 'CAF' },
  { name: 'Algeria', code: 'ALG', flag: '🇩🇿', continent: 'Africa', confederation: 'CAF' },
  { name: 'Ivory Coast', code: 'CIV', flag: '🇨🇮', continent: 'Africa', confederation: 'CAF' },
  { name: 'Ghana', code: 'GHA', flag: '🇬🇭', continent: 'Africa', confederation: 'CAF' },
  { name: 'Cameroon', code: 'CMR', flag: '🇨🇲', continent: 'Africa', confederation: 'CAF' },
  { name: 'Tunisia', code: 'TUN', flag: '🇹🇳', continent: 'Africa', confederation: 'CAF' },
  { name: 'South Africa', code: 'RSA', flag: '🇿🇦', continent: 'Africa', confederation: 'CAF' },
  { name: 'DR Congo', code: 'COD', flag: '🇨🇩', continent: 'Africa', confederation: 'CAF' },
  { name: 'Mali', code: 'MLI', flag: '🇲🇱', continent: 'Africa', confederation: 'CAF' },
  { name: 'Burkina Faso', code: 'BFA', flag: '🇧🇫', continent: 'Africa', confederation: 'CAF' },
  { name: 'Guinea', code: 'GUI', flag: '🇬🇳', continent: 'Africa', confederation: 'CAF' },
  { name: 'Zambia', code: 'ZAM', flag: '🇿🇲', continent: 'Africa', confederation: 'CAF' },
  { name: 'Angola', code: 'ANG', flag: '🇦🇴', continent: 'Africa', confederation: 'CAF' },
  { name: 'Cape Verde', code: 'CPV', flag: '🇨🇻', continent: 'Africa', confederation: 'CAF' },
  { name: 'Uganda', code: 'UGA', flag: '🇺🇬', continent: 'Africa', confederation: 'CAF' },
  { name: 'Gabon', code: 'GAB', flag: '🇬🇦', continent: 'Africa', confederation: 'CAF' },
  { name: 'Equatorial Guinea', code: 'EQG', flag: '🇬🇶', continent: 'Africa', confederation: 'CAF' },
  { name: 'Kenya', code: 'KEN', flag: '🇰🇪', continent: 'Africa', confederation: 'CAF' },
  { name: 'Tanzania', code: 'TAN', flag: '🇹🇿', continent: 'Africa', confederation: 'CAF' },
  { name: 'Mozambique', code: 'MOZ', flag: '🇲🇿', continent: 'Africa', confederation: 'CAF' },
  { name: 'Zimbabwe', code: 'ZIM', flag: '🇿🇼', continent: 'Africa', confederation: 'CAF' },
  { name: 'Madagascar', code: 'MAD', flag: '🇲🇬', continent: 'Africa', confederation: 'CAF' },
  { name: 'Mauritania', code: 'MTN', flag: '🇲🇷', continent: 'Africa', confederation: 'CAF' },
  { name: 'Namibia', code: 'NAM', flag: '🇳🇦', continent: 'Africa', confederation: 'CAF' },
  { name: 'Sierra Leone', code: 'SLE', flag: '🇸🇱', continent: 'Africa', confederation: 'CAF' },
  { name: 'Togo', code: 'TOG', flag: '🇹🇬', continent: 'Africa', confederation: 'CAF' },
  { name: 'Benin', code: 'BEN', flag: '🇧🇯', continent: 'Africa', confederation: 'CAF' },
  { name: 'Libya', code: 'LBY', flag: '🇱🇾', continent: 'Africa', confederation: 'CAF' },
  { name: 'Sudan', code: 'SUD', flag: '🇸🇩', continent: 'Africa', confederation: 'CAF' },
  { name: 'Ethiopia', code: 'ETH', flag: '🇪🇹', continent: 'Africa', confederation: 'CAF' },
  { name: 'Rwanda', code: 'RWA', flag: '🇷🇼', continent: 'Africa', confederation: 'CAF' },
  { name: 'Gambia', code: 'GAM', flag: '🇬🇲', continent: 'Africa', confederation: 'CAF' },
  { name: 'Liberia', code: 'LBR', flag: '🇱🇷', continent: 'Africa', confederation: 'CAF' },

  // --- OCEANIA (OFC) ---
  { name: 'New Zealand', code: 'NZL', flag: '🇳🇿', continent: 'Oceania', confederation: 'OFC' },
  { name: 'Fiji', code: 'FIJ', flag: '🇫🇯', continent: 'Oceania', confederation: 'OFC' },
  { name: 'Solomon Islands', code: 'SOL', flag: '🇸🇧', continent: 'Oceania', confederation: 'OFC' },
  { name: 'Papua New Guinea', code: 'PNG', flag: '🇵🇬', continent: 'Oceania', confederation: 'OFC' },
  { name: 'New Caledonia', code: 'NCL', flag: '🇳🇨', continent: 'Oceania', confederation: 'OFC' },
  { name: 'Tahiti', code: 'TAH', flag: '🇵🇫', continent: 'Oceania', confederation: 'OFC' },
  { name: 'Vanuatu', code: 'VAN', flag: '🇻🇺', continent: 'Oceania', confederation: 'OFC' },
  { name: 'Samoa', code: 'SAM', flag: '🇼🇸', continent: 'Oceania', confederation: 'OFC' },
  { name: 'Tonga', code: 'TGA', flag: '🇹🇴', continent: 'Oceania', confederation: 'OFC' },
  { name: 'Cook Islands', code: 'COK', flag: '🇨🇰', continent: 'Oceania', confederation: 'OFC' },
];

export interface ExamQuestion {
  id: number;
  category: 'Tactical Transition' | 'Squad Periodization' | 'Executive Directive' | 'Youth Transition' | 'In-Game Tactical Management';
  question: string;
  scenario: string;
  options: {
    letter: 'A' | 'B' | 'C' | 'D';
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export const COACHING_LICENSE_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    category: 'Tactical Transition',
    question: 'When losing possession in the attacking third, what is the core tenet of modern transitional pressing?',
    scenario: 'Your wide winger loses the ball at the corner of the opposing penalty area.',
    options: [
      {
        letter: 'A',
        text: 'Immediately retreat all 10 outfield players into your own penalty box.',
        isCorrect: false,
        feedback: 'Too passive—this gives the opposition full freedom to progress the ball through midfield cleanly.',
      },
      {
        letter: 'B',
        text: 'Execute a 5-second counter-press to suffocate passing lanes and regain the ball immediately.',
        isCorrect: true,
        feedback: 'Correct! The 5-second counter-press capitalizes on the opposing ball-winner being off-balance and looking for passing outlets.',
      },
      {
        letter: 'C',
        text: 'Commit a tactical red card tackle to reset game flow.',
        isCorrect: false,
        feedback: 'Severe breach of sporting conduct and leaves your side down to 10 men.',
      },
      {
        letter: 'D',
        text: 'Instruct the goalkeeper to advance to the halfway line.',
        isCorrect: false,
        feedback: 'Leaves the net wide open for long-range counter-attacking strikes.',
      },
    ],
  },
  {
    id: 2,
    category: 'Squad Periodization',
    question: 'Your squad faces 2 matches in 4 days. A 32-year-old key playmaker is at 62% fitness. What is the soundest executive/coaching choice?',
    scenario: 'A crucial league clash is followed 72 hours later by a cup quarter-final.',
    options: [
      {
        letter: 'A',
        text: 'Force the playmaker to play 90 minutes in both fixtures without recovery sessions.',
        isCorrect: false,
        feedback: 'High probability of muscle tear or hamstring injury and severe morale decline.',
      },
      {
        letter: 'B',
        text: 'Terminate their contract immediately for poor physical conditioning.',
        isCorrect: false,
        feedback: 'Damages club finances and alienates player dressing room trust.',
      },
      {
        letter: 'C',
        text: 'Rotate the squad, manage their minutes with a dedicated physio recovery protocol, and utilize an academy graduate.',
        isCorrect: true,
        feedback: 'Correct! Periodized load management protects player asset value and develops younger squad depth.',
      },
      {
        letter: 'D',
        text: 'Triple their daily high-intensity sprint training between matches.',
        isCorrect: false,
        feedback: 'Accelerates acute fatigue and drastically elevates soft-tissue rupture risks.',
      },
    ],
  },
  {
    id: 3,
    category: 'Executive Directive',
    question: 'The opposition employs a compact 5-4-1 low block defending their penalty box. Which directive best creates scoring opportunities?',
    scenario: 'Your side dominates 72% possession but cannot penetrate the central congested channel.',
    options: [
      {
        letter: 'A',
        text: 'Instruct attackers to repeatedly shoot from 45 yards into the defensive wall.',
        isCorrect: false,
        feedback: 'Inefficient shot selection yielding low xG and constant turnovers.',
      },
      {
        letter: 'B',
        text: 'Direct fullbacks to provide maximum width, overload half-spaces, and generate rapid switch plays.',
        isCorrect: true,
        feedback: 'Correct! Stretching the pitch horizontally creates gaps between the 3 center-backs and creates passing lanes into half-spaces.',
      },
      {
        letter: 'C',
        text: 'Tell your defenders to stop passing forward completely.',
        isCorrect: false,
        feedback: 'Eliminates any goal threat and plays directly into the defensive opponent’s plan.',
      },
      {
        letter: 'D',
        text: 'Sub out all 4 defenders for 4 goalkeepers.',
        isCorrect: false,
        feedback: 'Nonsensical squad deployment.',
      },
    ],
  },
  {
    id: 4,
    category: 'Youth Transition',
    question: 'When integrating a 17-year-old academy prospect into the senior first team, what is the primary focus of Level 1 coaching doctrine?',
    scenario: 'A promising youth midfielder is promoted to senior training sessions.',
    options: [
      {
        letter: 'A',
        text: 'Gradual technical acclimatization, mentoring by senior leaders, and low-pressure debut minutes.',
        isCorrect: true,
        feedback: 'Correct! Foundation doctrine prioritizes psychological safety, tactile adaptation, and controlled developmental minutes.',
      },
      {
        letter: 'B',
        text: 'Placing all media pressure on the teenager to save the club from relegation alone.',
        isCorrect: false,
        feedback: 'Destroys young player psychological resilience and exposes them to undue media scrutiny.',
      },
      {
        letter: 'C',
        text: 'Isolating the prospect from the senior dressing room entirely.',
        isCorrect: false,
        feedback: 'Prevents team bonding and tactical synergy.',
      },
      {
        letter: 'D',
        text: 'Demanding the teenager play every position simultaneously.',
        isCorrect: false,
        feedback: 'Stunts positional intuition and basic tactical comprehension.',
      },
    ],
  },
  {
    id: 5,
    category: 'In-Game Tactical Management',
    question: 'You lead 1-0 in the 84th minute away from home. The opponent throws on two tall target men and launches direct high aerial crosses. How do you adapt?',
    scenario: 'The stadium crowd is roaring and aerial pressure is intensifying.',
    options: [
      {
        letter: 'A',
        text: 'Reinforce aerial duel presence with an additional center-back, organize deep compactness, and manage game tempo.',
        isCorrect: true,
        feedback: 'Correct! Neutralizing direct second-ball knockdowns and controlling restarts secures matchday points.',
      },
      {
        letter: 'B',
        text: 'Remove your goalkeeper for a fourth winger.',
        isCorrect: false,
        feedback: 'Guarantees conceded goals from crosses.',
      },
      {
        letter: 'C',
        text: 'Walk off the pitch before the referee blows the final whistle.',
        isCorrect: false,
        feedback: 'Forfeits the fixture and incurs severe regulatory fines and points deductions.',
      },
      {
        letter: 'D',
        text: 'Order defenders to jump with eyes closed.',
        isCorrect: false,
        feedback: 'Dangerous and ineffective defensive technique.',
      },
    ],
  },
];

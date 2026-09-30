import React from 'react';
import { CountryCode } from '../types/calendar';

interface CountryFlagProps {
  country: CountryCode;
  className?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ country, className = 'w-5 h-3.5' }) => {
  switch (country) {
    case 'UZ':
      // Uzbekistan: Blue, Red piping, White, Red piping, Green with crescent & 12 stars
      return (
        <svg
          viewBox="0 0 500 250"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue stripe */}
          <rect width="500" height="80" fill="#0099B5" />
          {/* Red line */}
          <rect y="80" width="500" height="5" fill="#CE1126" />
          {/* White stripe */}
          <rect y="85" width="500" height="80" fill="#FFFFFF" />
          {/* Red line */}
          <rect y="165" width="500" height="5" fill="#CE1126" />
          {/* Green stripe */}
          <rect y="170" width="500" height="80" fill="#1EB53A" />
          {/* Crescent */}
          <circle cx="70" cy="40" r="30" fill="#FFFFFF" />
          <circle cx="80" cy="40" r="25" fill="#0099B5" />
          {/* Stars */}
          <g fill="#FFFFFF">
            {/* 3 stars row 1 */}
            <circle cx="120" cy="22" r="4" />
            <circle cx="136" cy="22" r="4" />
            <circle cx="152" cy="22" r="4" />
            {/* 4 stars row 2 */}
            <circle cx="104" cy="38" r="4" />
            <circle cx="120" cy="38" r="4" />
            <circle cx="136" cy="38" r="4" />
            <circle cx="152" cy="38" r="4" />
            {/* 5 stars row 3 */}
            <circle cx="88" cy="54" r="4" />
            <circle cx="104" cy="54" r="4" />
            <circle cx="120" cy="54" r="4" />
            <circle cx="136" cy="54" r="4" />
            <circle cx="152" cy="54" r="4" />
          </g>
        </svg>
      );

    case 'RU':
      // Russia: White, Blue, Red
      return (
        <svg
          viewBox="0 0 300 200"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="66.6" fill="#FFFFFF" />
          <rect y="66.6" width="300" height="66.6" fill="#0039A6" />
          <rect y="133.2" width="300" height="66.8" fill="#D52B1E" />
        </svg>
      );

    case 'KZ':
      // Kazakhstan: Cyan blue with gold sun & eagle
      return (
        <svg
          viewBox="0 0 300 150"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="150" fill="#00AFCA" />
          {/* Gold Sun & Steppe Eagle */}
          <circle cx="150" cy="70" r="22" fill="#FEC50C" />
          <path d="M 120,95 Q 150,110 180,95 Q 150,102 120,95 Z" fill="#FEC50C" />
          {/* Left ornament bar */}
          <rect x="10" y="10" width="16" height="130" fill="#FEC50C" rx="4" />
        </svg>
      );

    case 'KG':
      // Kyrgyzstan: Red with yellow tunduk
      return (
        <svg
          viewBox="0 0 300 180"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="180" fill="#E8112D" />
          <circle cx="150" cy="90" r="38" fill="#FFE000" />
          <circle cx="150" cy="90" r="28" fill="#E8112D" />
          <circle cx="150" cy="90" r="16" fill="#FFE000" />
        </svg>
      );

    case 'BY':
      // Belarus: Red, Green with left ornament
      return (
        <svg
          viewBox="0 0 300 150"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="100" fill="#C8313E" />
          <rect y="100" width="300" height="50" fill="#438244" />
          <rect width="40" height="150" fill="#FFFFFF" />
          <rect x="8" y="10" width="24" height="130" fill="#C8313E" rx="2" />
        </svg>
      );

    case 'US':
      // USA
      return (
        <svg
          viewBox="0 0 300 160"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="160" fill="#B22234" />
          {[...Array(6)].map((_, i) => (
            <rect key={i} y={i * 24.6 + 12.3} width="300" height="12.3" fill="#FFFFFF" />
          ))}
          <rect width="120" height="86" fill="#3C3B6E" />
          <g fill="#FFFFFF">
            <circle cx="20" cy="20" r="4" />
            <circle cx="50" cy="20" r="4" />
            <circle cx="80" cy="20" r="4" />
            <circle cx="100" cy="20" r="4" />
            <circle cx="35" cy="40" r="4" />
            <circle cx="65" cy="40" r="4" />
            <circle cx="95" cy="40" r="4" />
            <circle cx="20" cy="65" r="4" />
            <circle cx="50" cy="65" r="4" />
            <circle cx="80" cy="65" r="4" />
            <circle cx="100" cy="65" r="4" />
          </g>
        </svg>
      );

    case 'GB':
      // UK: Union Jack
      return (
        <svg
          viewBox="0 0 300 150"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="150" fill="#012169" />
          <path d="M0,0 L300,150 M300,0 L0,150" stroke="#FFFFFF" strokeWidth="30" />
          <path d="M0,0 L300,150 M300,0 L0,150" stroke="#C8102E" strokeWidth="16" />
          <path d="M150,0 V150 M0,75 H300" stroke="#FFFFFF" strokeWidth="50" />
          <path d="M150,0 V150 M0,75 H300" stroke="#C8102E" strokeWidth="30" />
        </svg>
      );

    case 'DE':
      // Germany: Black, Red, Gold
      return (
        <svg
          viewBox="0 0 300 180"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="60" fill="#000000" />
          <rect y="60" width="300" height="60" fill="#DD0000" />
          <rect y="120" width="300" height="60" fill="#FFCE00" />
        </svg>
      );

    case 'FR':
      // France: Blue, White, Red
      return (
        <svg
          viewBox="0 0 300 200"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100" height="200" fill="#002654" />
          <rect x="100" width="100" height="200" fill="#FFFFFF" />
          <rect x="200" width="100" height="200" fill="#ED2939" />
        </svg>
      );

    case 'TR':
      // Turkey: Red with crescent and star
      return (
        <svg
          viewBox="0 0 300 200"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="200" fill="#E30A17" />
          <circle cx="120" cy="100" r="50" fill="#FFFFFF" />
          <circle cx="132" cy="100" r="40" fill="#E30A17" />
          <polygon
            points="180,100 162,106 168,88 153,77 172,77 180,60 188,77 207,77 192,88 198,106"
            fill="#FFFFFF"
            transform="scale(0.7) translate(80, 45)"
          />
        </svg>
      );

    case 'AE':
      // UAE: Red on left, Green, White, Black
      return (
        <svg
          viewBox="0 0 300 150"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="50" fill="#00732F" />
          <rect y="50" width="300" height="50" fill="#FFFFFF" />
          <rect y="100" width="300" height="50" fill="#000000" />
          <rect width="80" height="150" fill="#FF0000" />
        </svg>
      );

    case 'CA':
      // Canada
      return (
        <svg
          viewBox="0 0 300 150"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="75" height="150" fill="#FF0000" />
          <rect x="75" width="150" height="150" fill="#FFFFFF" />
          <rect x="225" width="75" height="150" fill="#FF0000" />
          <path
            d="M150,30 L158,62 L185,55 L175,75 L195,85 L165,95 L168,125 L150,115 L132,125 L135,95 L105,85 L125,75 L115,55 L142,62 Z"
            fill="#FF0000"
          />
        </svg>
      );

    case 'ES':
      // Spain: Red, Yellow, Red
      return (
        <svg
          viewBox="0 0 300 200"
          className={`${className} rounded-[2px] shadow-2xs shrink-0 object-cover`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="300" height="50" fill="#AA151B" />
          <rect y="50" width="300" height="100" fill="#F1BF00" />
          <rect y="150" width="300" height="50" fill="#AA151B" />
        </svg>
      );

    case 'GLOBAL':
    default:
      // Globe
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${className} rounded-[2px] shadow-2xs shrink-0`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" fill="#0066FF" />
          <ellipse cx="50" cy="50" rx="46" ry="24" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <ellipse cx="50" cy="50" rx="24" ry="46" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="2" y1="50" x2="98" y2="50" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="50" y1="2" x2="50" y2="98" stroke="#FFFFFF" strokeWidth="6" />
        </svg>
      );
  }
};

import React from 'react';

interface FlagProps {
  countryId: string;
  className?: string;
  size?: number;
}

export const CountryFlag: React.FC<FlagProps> = ({ countryId, className = '', size = 22 }) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 32 32',
    className: `rounded-full shrink-0 shadow-2xs ${className}`,
    style: { minWidth: size, minHeight: size },
  };

  switch (countryId) {
    case 'uz':
      // Uzbekistan circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="uz-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#uz-clip)">
            {/* Blue stripe */}
            <rect x="0" y="0" width="32" height="10" fill="#0099B5" />
            {/* Red thin border */}
            <rect x="0" y="10" width="32" height="1" fill="#CE1126" />
            {/* White stripe */}
            <rect x="0" y="11" width="32" height="10" fill="#FFFFFF" />
            {/* Red thin border */}
            <rect x="0" y="21" width="32" height="1" fill="#CE1126" />
            {/* Green stripe */}
            <rect x="0" y="22" width="32" height="10" fill="#1EB53A" />
            {/* Crescent */}
            <circle cx="7.5" cy="5" r="3.2" fill="#FFFFFF" />
            <circle cx="8.5" cy="5" r="2.8" fill="#0099B5" />
            {/* Stars row 1 */}
            <circle cx="13" cy="3" r="0.6" fill="#FFFFFF" />
            <circle cx="15" cy="3" r="0.6" fill="#FFFFFF" />
            <circle cx="17" cy="3" r="0.6" fill="#FFFFFF" />
            {/* Stars row 2 */}
            <circle cx="12" cy="5" r="0.6" fill="#FFFFFF" />
            <circle cx="14" cy="5" r="0.6" fill="#FFFFFF" />
            <circle cx="16" cy="5" r="0.6" fill="#FFFFFF" />
            <circle cx="18" cy="5" r="0.6" fill="#FFFFFF" />
            {/* Stars row 3 */}
            <circle cx="11" cy="7" r="0.6" fill="#FFFFFF" />
            <circle cx="13" cy="7" r="0.6" fill="#FFFFFF" />
            <circle cx="15" cy="7" r="0.6" fill="#FFFFFF" />
            <circle cx="17" cy="7" r="0.6" fill="#FFFFFF" />
            <circle cx="19" cy="7" r="0.6" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'ru':
      // Russia circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="ru-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#ru-clip)">
            <rect x="0" y="0" width="32" height="10.66" fill="#FFFFFF" />
            <rect x="0" y="10.66" width="32" height="10.66" fill="#0052B4" />
            <rect x="0" y="21.33" width="32" height="10.66" fill="#D80027" />
          </g>
        </svg>
      );

    case 'kz':
      // Kazakhstan circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="kz-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#kz-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#00AFCA" />
            {/* Sun */}
            <circle cx="17" cy="13" r="4.5" fill="#FFD100" />
            {/* Sun rays ring */}
            <circle cx="17" cy="13" r="6" stroke="#FFD100" strokeWidth="0.8" strokeDasharray="1.2 1.2" fill="none" />
            {/* Soaring Steppe Eagle */}
            <path d="M12 19.5 C15 17.5 19 17.5 22 19.5 C19 18.2 15 18.2 12 19.5 Z" fill="#FFD100" />
            {/* Left ornamental bar */}
            <rect x="2" y="4" width="3" height="24" rx="1.5" fill="#FFD100" opacity="0.9" />
          </g>
        </svg>
      );

    case 'eu':
      // European Union circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="eu-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#eu-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#003399" />
            {/* Circle of 12 stars */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const cx = 16 + 9 * Math.cos(angle);
              const cy = 16 + 9 * Math.sin(angle);
              return <circle key={i} cx={cx} cy={cy} r="1.3" fill="#FFCC00" />;
            })}
          </g>
        </svg>
      );

    case 'us':
      // United States circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="us-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#us-clip)">
            {/* 13 stripes */}
            {[...Array(13)].map((_, i) => (
              <rect
                key={i}
                x="0"
                y={i * (32 / 13)}
                width="32"
                height={32 / 13 + 0.2}
                fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'}
              />
            ))}
            {/* Blue canton */}
            <rect x="0" y="0" width="15" height="17.2" fill="#3C3B6E" />
            {/* Stars dots */}
            <circle cx="3.5" cy="4" r="0.9" fill="#FFFFFF" />
            <circle cx="7.5" cy="4" r="0.9" fill="#FFFFFF" />
            <circle cx="11.5" cy="4" r="0.9" fill="#FFFFFF" />
            <circle cx="5.5" cy="8.5" r="0.9" fill="#FFFFFF" />
            <circle cx="9.5" cy="8.5" r="0.9" fill="#FFFFFF" />
            <circle cx="3.5" cy="13" r="0.9" fill="#FFFFFF" />
            <circle cx="7.5" cy="13" r="0.9" fill="#FFFFFF" />
            <circle cx="11.5" cy="13" r="0.9" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'gb':
      // United Kingdom circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="gb-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#gb-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#012169" />
            {/* White diagonals */}
            <line x1="0" y1="0" x2="32" y2="32" stroke="#FFFFFF" strokeWidth="5.5" />
            <line x1="32" y1="0" x2="0" y2="32" stroke="#FFFFFF" strokeWidth="5.5" />
            {/* Red diagonals */}
            <line x1="0" y1="0" x2="32" y2="32" stroke="#C8102E" strokeWidth="2.2" />
            <line x1="32" y1="0" x2="0" y2="32" stroke="#C8102E" strokeWidth="2.2" />
            {/* White cross */}
            <rect x="12" y="0" width="8" height="32" fill="#FFFFFF" />
            <rect x="0" y="12" width="32" height="8" fill="#FFFFFF" />
            {/* Red cross */}
            <rect x="13.5" y="0" width="5" height="32" fill="#C8102E" />
            <rect x="0" y="13.5" width="32" height="5" fill="#C8102E" />
          </g>
        </svg>
      );

    case 'de':
      // Germany circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="de-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#de-clip)">
            <rect x="0" y="0" width="32" height="10.66" fill="#000000" />
            <rect x="0" y="10.66" width="32" height="10.66" fill="#DD0000" />
            <rect x="0" y="21.33" width="32" height="10.66" fill="#FFCE00" />
          </g>
        </svg>
      );

    case 'ca':
      // Canada circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="ca-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#ca-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#FFFFFF" />
            <rect x="0" y="0" width="8" height="32" fill="#FF0000" />
            <rect x="24" y="0" width="8" height="32" fill="#FF0000" />
            {/* Stylized Maple leaf */}
            <path
              d="M16 8 L17.5 12.5 L20 12 L18.5 14.5 L21 16 L17.5 17.5 L18 21 L16 19.5 L14 21 L14.5 17.5 L11 16 L13.5 14.5 L12 12 L14.5 12.5 Z"
              fill="#FF0000"
            />
            <rect x="15.4" y="19" width="1.2" height="4" fill="#FF0000" />
          </g>
        </svg>
      );

    case 'jp':
      // Japan circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="jp-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#jp-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#FFFFFF" />
            <circle cx="16" cy="16" r="8.5" fill="#BC002D" />
          </g>
        </svg>
      );

    case 'ch':
      // Switzerland circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="ch-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#ch-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#D52B1E" />
            <rect x="13" y="7" width="6" height="18" fill="#FFFFFF" />
            <rect x="7" y="13" width="18" height="6" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'cn':
      // China circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="cn-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#cn-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#DE2910" />
            {/* Big star */}
            <polygon points="8,5 9.2,8.8 13,8.8 9.9,11 11.1,14.8 8,12.5 4.9,14.8 6.1,11 3,8.8 6.8,8.8" fill="#FFDE00" transform="scale(0.8) translate(2, 2)" />
          </g>
        </svg>
      );

    case 'au':
      // Australia circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="au-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#au-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#00008B" />
            <rect x="0" y="0" width="14" height="14" fill="#012169" />
            <line x1="0" y1="0" x2="14" y2="14" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="14" y1="0" x2="0" y2="14" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="5.5" y="0" width="3" height="14" fill="#FFFFFF" />
            <rect x="0" y="5.5" width="14" height="3" fill="#FFFFFF" />
            <rect x="6.2" y="0" width="1.6" height="14" fill="#CC0000" />
            <rect x="0" y="6.2" width="14" height="1.6" fill="#CC0000" />
            {/* Southern Cross stars */}
            <circle cx="24" cy="7" r="1" fill="#FFFFFF" />
            <circle cx="21" cy="14" r="1" fill="#FFFFFF" />
            <circle cx="26" cy="17" r="1" fill="#FFFFFF" />
            <circle cx="24" cy="25" r="1.3" fill="#FFFFFF" />
            <circle cx="8" cy="22" r="2" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'by':
      // Belarus circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="by-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#by-clip)">
            <rect x="0" y="0" width="32" height="21" fill="#C8102E" />
            <rect x="0" y="21" width="32" height="11" fill="#007A3D" />
            <rect x="0" y="0" width="6" height="32" fill="#FFFFFF" />
            <rect x="1" y="2" width="4" height="28" fill="#C8102E" opacity="0.7" />
          </g>
        </svg>
      );

    case 'kg':
      // Kyrgyzstan circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="kg-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#kg-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#E8112D" />
            <circle cx="16" cy="16" r="6" fill="#FFD100" />
            <circle cx="16" cy="16" r="4.5" fill="#E8112D" />
            <circle cx="16" cy="16" r="2.5" fill="#FFD100" />
          </g>
        </svg>
      );

    case 'am':
      // Armenia circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="am-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#am-clip)">
            <rect x="0" y="0" width="32" height="10.66" fill="#D90012" />
            <rect x="0" y="10.66" width="32" height="10.66" fill="#0033A0" />
            <rect x="0" y="21.33" width="32" height="10.66" fill="#F2A800" />
          </g>
        </svg>
      );

    case 'ge':
      // Georgia circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="ge-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#ge-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#FFFFFF" />
            <rect x="13.5" y="0" width="5" height="32" fill="#FF0000" />
            <rect x="0" y="13.5" width="32" height="5" fill="#FF0000" />
            <rect x="5.5" y="5.5" width="3" height="3" fill="#FF0000" />
            <rect x="23.5" y="5.5" width="3" height="3" fill="#FF0000" />
            <rect x="5.5" y="23.5" width="3" height="3" fill="#FF0000" />
            <rect x="23.5" y="23.5" width="3" height="3" fill="#FF0000" />
          </g>
        </svg>
      );

    case 'tr':
      // Turkey circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="tr-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#tr-clip)">
            <rect x="0" y="0" width="32" height="32" fill="#E30A17" />
            <circle cx="14" cy="16" r="7" fill="#FFFFFF" />
            <circle cx="16" cy="16" r="5.6" fill="#E30A17" />
            <polygon points="21,16 23,17.5 22.2,15 24,13.5 21.8,13.5" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'ae':
      // UAE circular flag
      return (
        <svg {...commonProps}>
          <clipPath id="ae-clip">
            <circle cx="16" cy="16" r="16" />
          </clipPath>
          <g clipPath="url(#ae-clip)">
            <rect x="8" y="0" width="24" height="10.66" fill="#00732F" />
            <rect x="8" y="10.66" width="24" height="10.66" fill="#FFFFFF" />
            <rect x="8" y="21.33" width="24" height="10.66" fill="#000000" />
            <rect x="0" y="0" width="8" height="32" fill="#FF0000" />
          </g>
        </svg>
      );

    default:
      // Globe / other
      return (
        <svg {...commonProps}>
          <circle cx="16" cy="16" r="15" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
          <path
            d="M5 16 C 5 10, 27 10, 27 16 C 27 22, 5 22, 5 16 Z"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />
          <ellipse cx="16" cy="16" rx="6" ry="15" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="16" y1="1" x2="16" y2="31" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="1" y1="16" x2="31" y2="16" stroke="#94A3B8" strokeWidth="1.2" />
        </svg>
      );
  }
};

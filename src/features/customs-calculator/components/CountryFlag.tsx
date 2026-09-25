import React from "react";

interface CountryFlagProps {
  code: string;
  className?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ code, className = "w-5 h-3.5" }) => {
  const baseClass = `${className} rounded-[2px] shadow-2xs shrink-0 object-cover inline-block`;

  switch (code.toUpperCase()) {
    case "UZ":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="6.67" fill="#0099B5" />
          <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
          <rect y="13.33" width="30" height="6.67" fill="#1EB53A" />
          <rect y="6.3" width="30" height="0.5" fill="#CE1126" />
          <rect y="13.1" width="30" height="0.5" fill="#CE1126" />
          <circle cx="4" cy="3.3" r="1.8" fill="#FFFFFF" />
          <circle cx="4.6" cy="3.3" r="1.5" fill="#0099B5" />
          <circle cx="7.5" cy="2" r="0.4" fill="#FFFFFF" />
          <circle cx="9.2" cy="2" r="0.4" fill="#FFFFFF" />
          <circle cx="10.9" cy="2" r="0.4" fill="#FFFFFF" />
        </svg>
      );

    case "CN":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="20" fill="#DE2910" />
          <polygon points="5,2 6.2,5.7 3,3.4 7,3.4 3.8,5.7" fill="#FFDE00" />
          <circle cx="10" cy="2.2" r="0.75" fill="#FFDE00" />
          <circle cx="12" cy="4.2" r="0.75" fill="#FFDE00" />
          <circle cx="12" cy="7.2" r="0.75" fill="#FFDE00" />
          <circle cx="10" cy="9.2" r="0.75" fill="#FFDE00" />
        </svg>
      );

    case "RU":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="6.67" fill="#FFFFFF" />
          <rect y="6.67" width="30" height="6.67" fill="#0039A6" />
          <rect y="13.33" width="30" height="6.67" fill="#D52B1E" />
        </svg>
      );

    case "KZ":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="20" fill="#00AFCA" />
          <circle cx="15" cy="10" r="3.5" fill="#FECD06" />
          <path d="M11 13.5 C13 12, 17 12, 19 13.5 C17 13, 13 13, 11 13.5 Z" fill="#FECD06" />
          <rect x="0" y="0" width="3.5" height="20" fill="#FECD06" opacity="0.8" />
        </svg>
      );

    case "TR":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="20" fill="#E30A17" />
          <circle cx="11" cy="10" r="5" fill="#FFFFFF" />
          <circle cx="12.2" cy="10" r="4" fill="#E30A17" />
          <polygon
            points="17,10 18.2,11.2 17.6,9.6 18.8,10.4 17.3,10.4"
            fill="#FFFFFF"
            transform="scale(1.3) translate(-4,-3)"
          />
        </svg>
      );

    case "US":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="20" fill="#B22234" />
          <rect y="1.54" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="4.62" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="7.69" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="10.77" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="13.85" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="16.92" width="30" height="1.54" fill="#FFFFFF" />
          <rect width="12" height="10.77" fill="#3C3B6E" />
          <circle cx="2" cy="2" r="0.5" fill="#FFFFFF" />
          <circle cx="6" cy="2" r="0.5" fill="#FFFFFF" />
          <circle cx="10" cy="2" r="0.5" fill="#FFFFFF" />
          <circle cx="4" cy="4" r="0.5" fill="#FFFFFF" />
          <circle cx="8" cy="4" r="0.5" fill="#FFFFFF" />
          <circle cx="2" cy="6" r="0.5" fill="#FFFFFF" />
          <circle cx="6" cy="6" r="0.5" fill="#FFFFFF" />
          <circle cx="10" cy="6" r="0.5" fill="#FFFFFF" />
          <circle cx="4" cy="8" r="0.5" fill="#FFFFFF" />
          <circle cx="8" cy="8" r="0.5" fill="#FFFFFF" />
        </svg>
      );

    case "DE":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="6.67" fill="#000000" />
          <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
          <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
        </svg>
      );

    case "AE":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="6.67" fill="#00732F" />
          <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
          <rect y="13.33" width="30" height="6.67" fill="#000000" />
          <rect width="7.5" height="20" fill="#FF0000" />
        </svg>
      );

    case "KR":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="20" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="4.5" fill="#CD2E3A" />
          <path
            d="M15 5.5 A 4.5 4.5 0 0 0 15 14.5 A 2.25 2.25 0 0 1 15 10 A 2.25 2.25 0 0 0 15 5.5 Z"
            fill="#0047A0"
          />
          <rect x="5" y="4" width="2" height="4" fill="#000000" transform="rotate(30 6 6)" />
          <rect x="23" y="4" width="2" height="4" fill="#000000" transform="rotate(-30 24 6)" />
          <rect x="5" y="12" width="2" height="4" fill="#000000" transform="rotate(-30 6 14)" />
          <rect x="23" y="12" width="2" height="4" fill="#000000" transform="rotate(30 24 14)" />
        </svg>
      );

    case "BY":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="13.33" fill="#C8102E" />
          <rect y="13.33" width="30" height="6.67" fill="#009A44" />
          <rect width="5" height="20" fill="#FFFFFF" />
          <rect x="1" y="0" width="3" height="20" fill="#C8102E" opacity="0.6" />
        </svg>
      );

    case "IN":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="6.67" fill="#FF9933" />
          <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
          <rect y="13.33" width="30" height="6.67" fill="#138808" />
          <circle cx="15" cy="10" r="2.2" stroke="#000080" strokeWidth="0.8" fill="none" />
        </svg>
      );

    case "IT":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="10" height="20" fill="#009246" />
          <rect x="10" width="10" height="20" fill="#FFFFFF" />
          <rect x="20" width="10" height="20" fill="#CE2B37" />
        </svg>
      );

    case "GB":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="20" fill="#012169" />
          <line x1="0" y1="0" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="0" y1="20" x2="30" y2="0" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="0" y1="0" x2="30" y2="20" stroke="#C8102E" strokeWidth="2" />
          <line x1="0" y1="20" x2="30" y2="0" stroke="#C8102E" strokeWidth="2" />
          <rect x="12" y="0" width="6" height="20" fill="#FFFFFF" />
          <rect x="0" y="7" width="30" height="6" fill="#FFFFFF" />
          <rect x="13.5" y="0" width="3" height="20" fill="#C8102E" />
          <rect x="0" y="8.5" width="30" height="3" fill="#C8102E" />
        </svg>
      );

    case "KG":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="20" fill="#E8112D" />
          <circle cx="15" cy="10" r="4" fill="#FFD100" />
          <circle cx="15" cy="10" r="3.2" fill="#E8112D" />
          <circle cx="15" cy="10" r="2.2" fill="#FFD100" />
        </svg>
      );

    case "TJ":
      return (
        <svg className={baseClass} viewBox="0 0 30 20" fill="none">
          <rect width="30" height="6" fill="#CC0000" />
          <rect y="6" width="30" height="8" fill="#FFFFFF" />
          <rect y="14" width="30" height="6" fill="#006600" />
          <polygon points="15,8 16,9.5 14,9.5" fill="#F8B800" />
        </svg>
      );

    default:
      return (
        <span className={`${className} flex items-center justify-center text-xs leading-none`}>
          🌐
        </span>
      );
  }
};

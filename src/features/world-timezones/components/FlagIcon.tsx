import React from 'react';

interface FlagIconProps {
  countryCode: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * High-quality SVG vector country flag with crisp rendering across all browsers and operating systems
 * (Windows, Linux, Android, iOS, macOS) where standard Unicode regional indicator emojis often render
 * as two-letter letters (e.g. 'US', 'GB', 'UZ') instead of actual national flag graphics.
 */
export const FlagIcon: React.FC<FlagIconProps> = ({
  countryCode,
  className = '',
  size = 'md',
}) => {
  const code = (countryCode || '').toLowerCase().trim();

  const sizeClasses = {
    xs: 'w-4 h-3 rounded-[2px]',
    sm: 'w-5 h-3.5 rounded-[2px]',
    md: 'w-6 h-4.5 rounded-[3px]',
    lg: 'w-8 h-5.5 rounded-[4px]',
  };

  if (!code) {
    return (
      <span className={`inline-block bg-slate-200 border border-slate-300 ${sizeClasses[size]} ${className}`} />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-black/10 bg-slate-100 ${sizeClasses[size]} ${className}`}
    >
      <img
        src={`https://flagcdn.com/${code}.svg`}
        alt={`${code.toUpperCase()} flag`}
        loading="lazy"
        className="w-full h-full object-cover select-none pointer-events-none"
        onError={(e) => {
          // Fallback if network or code doesn't exist
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </span>
  );
};

import React from 'react';

interface FlagIconProps {
  code: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-6 h-4',
    lg: 'w-8 h-5.5',
  };

  const currentSize = sizeClasses[size];

  switch (code.toUpperCase()) {
    case 'USD':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#bd3d44" d="M0 0h640v480H0z"/>
          <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 276.9h640M0 350.8h640M0 424.6h640"/>
          <path fill="#192f5d" d="M0 0h260v258.5H0z"/>
          {/* Stylized stars */}
          <g fill="#fff">
            {[...Array(9)].map((_, r) =>
              [...Array(r % 2 === 0 ? 6 : 5)].map((_, c) => (
                <circle
                  key={`star-${r}-${c}`}
                  cx={20 + c * 44 + (r % 2 === 1 ? 22 : 0)}
                  cy={16 + r * 28}
                  r="6"
                />
              ))
            )}
          </g>
        </svg>
      );

    case 'EUR':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#039" d="M0 0h640v480H0z"/>
          <g fill="#fc0" transform="translate(320,240)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <circle
                key={i}
                cx={120 * Math.cos((angle * Math.PI) / 180)}
                cy={120 * Math.sin((angle * Math.PI) / 180)}
                r="12"
              />
            ))}
          </g>
        </svg>
      );

    case 'RUB':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#fff" d="M0 0h640v160H0z"/>
          <path fill="#0039a6" d="M0 160h640v160H0z"/>
          <path fill="#d52b1e" d="M0 320h640v160H0z"/>
        </svg>
      );

    case 'CNY':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#de2910" d="M0 0h640v480H0z"/>
          <g fill="#ffde00">
            {/* Big star */}
            <polygon points="106,48 119,86 160,86 127,110 140,149 106,124 73,149 86,110 53,86 94,86" />
            {/* Small stars */}
            <circle cx="200" cy="48" r="14"/>
            <circle cx="240" cy="88" r="14"/>
            <circle cx="240" cy="150" r="14"/>
            <circle cx="200" cy="190" r="14"/>
          </g>
        </svg>
      );

    case 'AED':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#00732f" d="M160 0h480v160H160z"/>
          <path fill="#fff" d="M160 160h480v160H160z"/>
          <path fill="#000" d="M160 320h480v160H160z"/>
          <path fill="#f00" d="M0 0h160v480H0z"/>
        </svg>
      );

    case 'TRY':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#e30a17" d="M0 0h640v480H0z"/>
          <circle cx="280" cy="240" r="120" fill="#fff"/>
          <circle cx="310" cy="240" r="96" fill="#e30a17"/>
          <polygon points="400,240 435,251 422,216 457,227 427,249" fill="#fff" transform="scale(1.2) translate(-60, -40)" />
        </svg>
      );

    case 'UZS':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#0099b5" d="M0 0h640v150H0z"/>
          <path fill="#ce1126" d="M0 150h640v15H0z"/>
          <path fill="#fff" d="M0 165h640v150H0z"/>
          <path fill="#ce1126" d="M0 315h640v15H0z"/>
          <path fill="#1eb53a" d="M0 330h640v150H0z"/>
          {/* Crescent */}
          <circle cx="80" cy="75" r="42" fill="#fff"/>
          <circle cx="95" cy="75" r="37" fill="#0099b5"/>
          {/* 12 Stars */}
          <g fill="#fff">
            {[0, 1, 2].map((r) =>
              [...Array(5 - r)].map((_, c) => (
                <circle key={`uzs-${r}-${c}`} cx={160 + c * 24} cy={45 + r * 28} r="5"/>
              ))
            )}
          </g>
        </svg>
      );

    case 'GBP':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#012169" d="M0 0h640v480H0z"/>
          <path stroke="#fff" strokeWidth="60" d="M0 0l640 480M640 0L0 480"/>
          <path stroke="#c8102e" strokeWidth="40" d="M0 0l640 480M640 0L0 480"/>
          <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640"/>
          <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/>
        </svg>
      );

    case 'KZT':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#00afca" d="M0 0h640v480H0z"/>
          {/* Sun and Eagle in Gold */}
          <circle cx="320" cy="210" r="65" fill="#fec50c"/>
          <path fill="#fec50c" d="M220 280c40-30 80-25 100-5 20-20 60-25 100 5-45-12-75-5-100 12-25-17-55-24-100-12z"/>
          <path fill="#fec50c" d="M0 0h50v480H0z" opacity="0.3"/>
        </svg>
      );

    case 'JPY':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#fff" d="M0 0h640v480H0z"/>
          <circle cx="320" cy="240" r="144" fill="#bc002d"/>
        </svg>
      );

    case 'CHF':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#d52b1e" d="M0 0h640v480H0z"/>
          <path fill="#fff" d="M270 120h100v240H270zM170 200h300v80H170z"/>
        </svg>
      );

    case 'KRW':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#fff" d="M0 0h640v480H0z"/>
          <circle cx="320" cy="240" r="110" fill="#cd2e3a"/>
          <path fill="#0047a0" d="M320 130a110 110 0 000 220 55 55 0 000-110 55 55 0 010-110z"/>
        </svg>
      );

    case 'SAR':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#0a6939" d="M0 0h640v480H0z"/>
          <path fill="#fff" d="M220 280h200v16H220zM190 288l40-16v32zM320 210c-30 0-40-15-60-15s-20 10-20 10 20-5 35-5 35 15 45 15 30-15 45-15 35 5 35 5-10-10-20-10-30 15-60 15z"/>
        </svg>
      );

    case 'CAD':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#ff0000" d="M0 0h160v480H0zM480 0h160v480H480z"/>
          <path fill="#fff" d="M160 0h320v480H160z"/>
          <path fill="#ff0000" d="M320 150l20 40 45-15-20 45 35 25-50 10 10 50-35-25-5 50-5-50-35 25 10-50-50-10 35-25-20-45 45 15z"/>
        </svg>
      );

    case 'AUD':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#00008b" d="M0 0h640v480H0z"/>
          {/* Mini Union Jack canton */}
          <g transform="scale(0.5)">
            <path fill="#012169" d="M0 0h640v480H0z"/>
            <path stroke="#fff" strokeWidth="60" d="M0 0l640 480M640 0L0 480"/>
            <path stroke="#c8102e" strokeWidth="40" d="M0 0l640 480M640 0L0 480"/>
            <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640"/>
            <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/>
          </g>
          {/* Southern cross stars */}
          <circle cx="500" cy="120" r="14" fill="#fff"/>
          <circle cx="540" cy="200" r="14" fill="#fff"/>
          <circle cx="500" cy="360" r="14" fill="#fff"/>
          <circle cx="440" cy="240" r="14" fill="#fff"/>
          <circle cx="160" cy="360" r="28" fill="#fff"/>
        </svg>
      );

    case 'SGD':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#ed2939" d="M0 0h640v240H0z"/>
          <path fill="#fff" d="M0 240h640v240H0z"/>
          <circle cx="120" cy="120" r="70" fill="#fff"/>
          <circle cx="145" cy="120" r="65" fill="#ed2939"/>
        </svg>
      );

    case 'KGS':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#e8112d" d="M0 0h640v480H0z"/>
          <circle cx="320" cy="240" r="90" fill="#ffe600"/>
          <circle cx="320" cy="240" r="70" fill="#e8112d"/>
          <path stroke="#ffe600" strokeWidth="12" d="M260 240c30 30 90 30 120 0M260 240c30-30 90-30 120 0M320 180c-30 30-30 90 0 120M320 180c30 30 30 90 0 120"/>
        </svg>
      );

    case 'TJS':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#cc0000" d="M0 0h640v140H0z"/>
          <path fill="#fff" d="M0 140h640v200H0z"/>
          <path fill="#006600" d="M0 340h640v140H0z"/>
          {/* Gold crown */}
          <path fill="#f8c300" d="M280 250h80v15h-80zM285 240l15-25 20 20 20-20 15 25z"/>
          <circle cx="320" cy="205" r="7" fill="#f8c300"/>
        </svg>
      );

    case 'INR':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#ff9933" d="M0 0h640v160H0z"/>
          <path fill="#fff" d="M0 160h640v160H0z"/>
          <path fill="#138808" d="M0 320h640v160H0z"/>
          <circle cx="320" cy="240" r="48" fill="none" stroke="#000080" strokeWidth="6"/>
          <circle cx="320" cy="240" r="10" fill="#000080"/>
        </svg>
      );

    case 'QAR':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#8d1b3d" d="M0 0h640v480H0z"/>
          <path fill="#fff" d="M0 0h180l60 26.6-60 26.6 60 26.6-60 26.6 60 26.6-60 26.6 60 26.6-60 26.6 60 26.6-60 26.6 60 26.6-60 26.6 60 26.6-60 26.6 60 26.6-60 26.6 60 26.6-60 26.6 60 26.6H0z"/>
        </svg>
      );

    case 'KWD':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#007a3d" d="M0 0h640v160H0z"/>
          <path fill="#fff" d="M0 160h640v160H0z"/>
          <path fill="#ce1126" d="M0 320h640v160H0z"/>
          <polygon points="0,0 160,160 160,320 0,480" fill="#000"/>
        </svg>
      );

    case 'MYR':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          {/* Stripes */}
          <path fill="#cc0000" d="M0 0h640v480H0z"/>
          {[...Array(7)].map((_, i) => (
            <path key={i} fill="#fff" d={`M0 ${i * 68.5}h640v34.2H0z`}/>
          ))}
          <path fill="#000066" d="M0 0h320v240H0z"/>
          <circle cx="150" cy="120" r="70" fill="#ffcc00"/>
          <circle cx="175" cy="120" r="60" fill="#000066"/>
        </svg>
      );

    case 'THB':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#a51931" d="M0 0h640v480H0z"/>
          <path fill="#f4f5f8" d="M0 80h640v320H0z"/>
          <path fill="#2d2a4a" d="M0 160h640v160H0z"/>
        </svg>
      );

    case 'PLN':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#fff" d="M0 0h640v240H0z"/>
          <path fill="#dc143c" d="M0 240h640v240H0z"/>
        </svg>
      );

    case 'GEL':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#fff" d="M0 0h640v480H0z"/>
          <path fill="#ff0000" d="M270 0h100v480H270zM0 190h640v100H0z"/>
          <g fill="#ff0000">
            <path d="M125 80h30v70h-30zM105 100h70v30h-70z"/>
            <path d="M485 80h30v70h-30zM465 100h70v30h-70z"/>
            <path d="M125 330h30v70h-30zM105 350h70v30h-70z"/>
            <path d="M485 330h30v70h-30zM465 350h70v30h-70z"/>
          </g>
        </svg>
      );

    case 'AZN':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#00b5e2" d="M0 0h640v160H0z"/>
          <path fill="#ef3340" d="M0 160h640v160H0z"/>
          <path fill="#509e2f" d="M0 320h640v160H0z"/>
          <circle cx="300" cy="240" r="50" fill="#fff"/>
          <circle cx="312" cy="240" r="42" fill="#ef3340"/>
          <circle cx="355" cy="240" r="14" fill="#fff"/>
        </svg>
      );

    case 'BYN':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#c8313e" d="M0 0h640v320H0z"/>
          <path fill="#4aa658" d="M0 320h640v160H0z"/>
          <path fill="#fff" d="M0 0h100v480H0z"/>
          <path fill="#c8313e" d="M10 20l40 40-40 40 40 40-40 40 40 40-40 40 40 40-40 40 40 40-40 40" stroke="#c8313e" strokeWidth="8"/>
        </svg>
      );

    case 'EGP':
      return (
        <svg viewBox="0 0 640 480" className={`inline-block rounded-xs overflow-hidden shadow-2xs ${currentSize} ${className}`}>
          <path fill="#ce1126" d="M0 0h640v160H0z"/>
          <path fill="#fff" d="M0 160h640v160H0z"/>
          <path fill="#000" d="M0 320h640v160H0z"/>
          {/* Golden eagle */}
          <circle cx="320" cy="240" r="25" fill="#c0932c"/>
        </svg>
      );

    default:
      return (
        <div className={`inline-flex items-center justify-center rounded-xs bg-slate-200 text-slate-700 font-bold text-[10px] ${currentSize} ${className}`}>
          {code.slice(0, 2)}
        </div>
      );
  }
};

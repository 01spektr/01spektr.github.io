import React from "react";

interface CountryFlagProps {
  countryCode: string;
  className?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode, className = "w-4 h-4" }) => {
  const code = countryCode.toUpperCase();

  switch (code) {
    case "US":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
          <g>
            <path
              fill="#d80027"
              d="M0 78.8h512v39.4H0zm0 78.8h512V197H0zm0 78.8h512v39.4H0zm0 78.8h512v39.4H0zm0 78.8h512v39.4H0z"
            />
            <path fill="#0052b4" d="M0 0h256v256H0z" />
            <circle cx="50" cy="50" r="10" fill="#fff" />
            <circle cx="128" cy="50" r="10" fill="#fff" />
            <circle cx="206" cy="50" r="10" fill="#fff" />
            <circle cx="89" cy="90" r="10" fill="#fff" />
            <circle cx="167" cy="90" r="10" fill="#fff" />
            <circle cx="50" cy="130" r="10" fill="#fff" />
            <circle cx="128" cy="130" r="10" fill="#fff" />
            <circle cx="206" cy="130" r="10" fill="#fff" />
            <circle cx="89" cy="170" r="10" fill="#fff" />
            <circle cx="167" cy="170" r="10" fill="#fff" />
            <circle cx="50" cy="210" r="10" fill="#fff" />
            <circle cx="128" cy="210" r="10" fill="#fff" />
            <circle cx="206" cy="210" r="10" fill="#fff" />
          </g>
        </svg>
      );

    case "EU":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#003399" />
          <g fill="#ffcc00">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const cx = 256 + 140 * Math.sin(rad);
              const cy = 256 - 140 * Math.cos(rad);
              return <circle key={deg} cx={cx} cy={cy} r="12" />;
            })}
          </g>
        </svg>
      );

    case "GB":
    case "UK":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#00247d" />
          <path fill="#fff" d="M0 0l512 512m0-512L0 512" stroke="#fff" strokeWidth="60" />
          <path fill="#cf142b" d="M0 0l512 512m0-512L0 512" stroke="#cf142b" strokeWidth="36" />
          <path fill="#fff" d="M256 0v512M0 256h512" stroke="#fff" strokeWidth="100" />
          <path fill="#cf142b" d="M256 0v512M0 256h512" stroke="#cf142b" strokeWidth="60" />
        </svg>
      );

    case "DE":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleDE">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleDE)">
            <path fill="#262626" d="M0 0h512v170.7H0z" />
            <path fill="#d80027" d="M0 170.7h512v170.6H0z" />
            <path fill="#ffda44" d="M0 341.3h512V512H0z" />
          </g>
        </svg>
      );

    case "AE":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleAE">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleAE)">
            <path fill="#496e2d" d="M0 0h512v170.7H0z" />
            <path fill="#f0f0f0" d="M0 170.7h512v170.6H0z" />
            <path fill="#262626" d="M0 341.3h512V512H0z" />
            <path fill="#d80027" d="M0 0h140v512H0z" />
          </g>
        </svg>
      );

    case "CA":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleCA">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleCA)">
            <path fill="#d80027" d="M0 0h130v512H0zm382 0h130v512H382z" />
            <path fill="#f0f0f0" d="M130 0h252v512H130z" />
            <path
              fill="#d80027"
              d="M256 120l20 40 45-15-20 45 45 15-35 30 15 45-45-10-15 50-10-50-45 10 15-45-35-30 45-15-20-45 45 15z"
            />
            <path fill="#d80027" d="M250 320h12v70h-12z" />
          </g>
        </svg>
      );

    case "JP":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
          <circle cx="256" cy="256" r="130" fill="#d80027" />
        </svg>
      );

    case "TR":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#e30a17" />
          <circle cx="230" cy="256" r="100" fill="#fff" />
          <circle cx="255" cy="256" r="80" fill="#e30a17" />
          <polygon fill="#fff" points="305,256 345,268 330,228 330,284 345,244" />
        </svg>
      );

    case "KZ":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#00afca" />
          <circle cx="256" cy="230" r="55" fill="#fec50c" />
          <path fill="#fec50c" d="M190 300c35-15 97-15 132 0-25 15-45 18-66 18s-41-3-66-18z" />
          <rect x="25" y="100" width="30" height="312" fill="#fec50c" rx="10" />
        </svg>
      );

    case "RU":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleRU">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleRU)">
            <path fill="#f0f0f0" d="M0 0h512v170.7H0z" />
            <path fill="#0052b4" d="M0 170.7h512v170.6H0z" />
            <path fill="#d80027" d="M0 341.3h512V512H0z" />
          </g>
        </svg>
      );

    case "UZ":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleUZ">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleUZ)">
            <path fill="#0099b5" d="M0 0h512v160H0z" />
            <path fill="#ce1126" d="M0 160h512v12H0zm0 180h512v12H0z" />
            <path fill="#ffffff" d="M0 172h512v168H0z" />
            <path fill="#1eb53a" d="M0 352h512v160H0z" />
            <circle cx="100" cy="80" r="38" fill="#ffffff" />
            <circle cx="112" cy="80" r="34" fill="#0099b5" />
            <circle cx="160" cy="65" r="7" fill="#ffffff" />
            <circle cx="180" cy="65" r="7" fill="#ffffff" />
            <circle cx="200" cy="65" r="7" fill="#ffffff" />
            <circle cx="160" cy="85" r="7" fill="#ffffff" />
            <circle cx="180" cy="85" r="7" fill="#ffffff" />
            <circle cx="160" cy="105" r="7" fill="#ffffff" />
          </g>
        </svg>
      );

    case "CH":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#d80027" />
          <path fill="#fff" d="M216 120h80v272h-80zM120 216h272v80H120z" />
        </svg>
      );

    case "AU":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#00008b" />
          <path fill="#fff" d="M0 0l256 256m0-256L0 256" stroke="#fff" strokeWidth="40" />
          <path fill="#cf142b" d="M0 0l256 256m0-256L0 256" stroke="#cf142b" strokeWidth="24" />
          <path fill="#fff" d="M128 0v256M0 128h256" stroke="#fff" strokeWidth="60" />
          <path fill="#cf142b" d="M128 0v256M0 128h256" stroke="#cf142b" strokeWidth="36" />
          <circle cx="380" cy="140" r="18" fill="#fff" />
          <circle cx="320" cy="360" r="16" fill="#fff" />
          <circle cx="420" cy="320" r="16" fill="#fff" />
          <circle cx="380" cy="420" r="16" fill="#fff" />
        </svg>
      );

    case "SG":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleSG">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleSG)">
            <path fill="#ed2939" d="M0 0h512v256H0z" />
            <path fill="#ffffff" d="M0 256h512v256H0z" />
            <circle cx="120" cy="128" r="60" fill="#fff" />
            <circle cx="140" cy="128" r="60" fill="#ed2939" />
          </g>
        </svg>
      );

    case "FR":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleFR">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleFR)">
            <path fill="#002395" d="M0 0h170.7v512H0z" />
            <path fill="#ffffff" d="M170.7 0h170.6v512H170.7z" />
            <path fill="#ed2939" d="M341.3 0h170.7v512H341.3z" />
          </g>
        </svg>
      );

    case "IT":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleIT">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleIT)">
            <path fill="#009246" d="M0 0h170.7v512H0z" />
            <path fill="#ffffff" d="M170.7 0h170.6v512H170.7z" />
            <path fill="#ce2b37" d="M341.3 0h170.7v512H341.3z" />
          </g>
        </svg>
      );

    case "ES":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleES">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleES)">
            <path fill="#aa151b" d="M0 0h512v128H0zm0 384h512v128H0z" />
            <path fill="#f1bf00" d="M0 128h512v256H0z" />
            <circle cx="160" cy="256" r="40" fill="#aa151b" />
            <circle cx="160" cy="256" r="25" fill="#f1bf00" />
          </g>
        </svg>
      );

    case "PL":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circlePL">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circlePL)">
            <path fill="#ffffff" d="M0 0h512v256H0z" />
            <path fill="#dc143c" d="M0 256h512v256H0z" />
          </g>
        </svg>
      );

    case "CN":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#de2910" />
          <polygon
            fill="#ffde00"
            points="120,70 135,115 180,115 145,140 160,185 120,155 80,185 95,140 60,115 105,115"
          />
          <circle cx="210" cy="80" r="14" fill="#ffde00" />
          <circle cx="240" cy="120" r="14" fill="#ffde00" />
          <circle cx="240" cy="170" r="14" fill="#ffde00" />
          <circle cx="210" cy="210" r="14" fill="#ffde00" />
        </svg>
      );

    case "IN":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleIN">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleIN)">
            <path fill="#ff9933" d="M0 0h512v170.7H0z" />
            <path fill="#ffffff" d="M0 170.7h512v170.6H0z" />
            <path fill="#138808" d="M0 341.3h512V512H0z" />
            <circle cx="256" cy="256" r="45" fill="none" stroke="#000080" strokeWidth="10" />
            <circle cx="256" cy="256" r="12" fill="#000080" />
          </g>
        </svg>
      );

    case "BR":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#009b3a" />
          <polygon fill="#fedf00" points="256,60 460,256 256,452 52,256" />
          <circle cx="256" cy="256" r="100" fill="#002776" />
          <path d="M165 240c50-30 130-30 182 20" stroke="#ffffff" strokeWidth="16" fill="none" />
        </svg>
      );

    case "SA":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#006c35" />
          <path d="M140 310h232v18h-232z" fill="#ffffff" />
          <path d="M170 290l40 10-40 10z" fill="#ffffff" />
          <text
            x="256"
            y="240"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="56"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            العربية
          </text>
        </svg>
      );

    case "KR":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <circle cx="256" cy="256" r="256" fill="#ffffff" stroke="#e2e8f0" strokeWidth="4" />
          <circle cx="256" cy="256" r="110" fill="#c60c30" />
          <path
            d="M256 146a55 55 0 0 0 0 110 55 55 0 0 1 0 110c60.7 0 110-49.3 110-110s-49.3-110-110-110z"
            fill="#003478"
          />
          <path d="M256 146a55 55 0 0 0 0 110 55 55 0 0 1 0-110z" fill="#c60c30" />
          {/* Trigrams */}
          <rect x="70" y="90" width="45" height="10" transform="rotate(35 92 95)" fill="#000" />
          <rect x="390" y="90" width="45" height="10" transform="rotate(-35 412 95)" fill="#000" />
          <rect x="70" y="410" width="45" height="10" transform="rotate(-35 92 415)" fill="#000" />
          <rect x="390" y="410" width="45" height="10" transform="rotate(35 412 415)" fill="#000" />
        </svg>
      );

    case "GE":
      return (
        <svg
          className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs`}
          viewBox="0 0 512 512"
        >
          <clipPath id="circleGE">
            <circle cx="256" cy="256" r="256" />
          </clipPath>
          <g clipPath="url(#circleGE)">
            <path fill="#ffffff" d="M0 0h512v512H0z" />
            <path fill="#ff0000" d="M216 0h80v512h-80zM0 216h512v80H0z" />
            <path fill="#ff0000" d="M90 70h40v60H90zm-10 10h60v40H80z" />
            <path fill="#ff0000" d="M380 70h40v60h-40zm-10 10h60v40h-60z" />
            <path fill="#ff0000" d="M90 380h40v60H90zm-10 10h60v40H80z" />
            <path fill="#ff0000" d="M380 380h40v60h-40zm-10 10h60v40h-60z" />
          </g>
        </svg>
      );

    default:
      return (
        <div
          className={`${className} rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0`}
        >
          {code.slice(0, 2)}
        </div>
      );
  }
};

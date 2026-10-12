export interface PresetLogo {
  id: string;
  name: string;
  category: "social" | "messenger" | "service";
  svg: string;
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: "telegram",
    name: "Telegram",
    category: "messenger",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#229ED9"/>
      <path d="M5.4 11.9L17.7 7.2c.6-.2 1.1.1.9.8l-2.1 9.9c-.2.7-.6.9-1.2.6l-3.2-2.4-1.5 1.5c-.2.2-.3.3-.6.3l.2-3.2 5.8-5.2c.3-.2-.1-.4-.4-.2l-7.2 4.5-3.1-1c-.7-.2-.7-.7.1-1z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ig-grad" cx="20%" cy="105%" r="130%">
          <stop offset="0%" stop-color="#FFDD55"/>
          <stop offset="25%" stop-color="#FF543E"/>
          <stop offset="60%" stop-color="#C837AB"/>
          <stop offset="100%" stop-color="#3771C8"/>
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)"/>
      <path d="M12 5.9c2 0 2.2 0 3 .1.7.1 1.1.2 1.4.3.4.1.6.3.9.6.3.3.5.5.6.9.1.3.2.7.3 1.4.1.8.1 1 .1 3s0 2.2-.1 3c-.1.7-.2 1.1-.3 1.4-.1.4-.3.6-.6.9-.3.3-.5.5-.9.6-.3.1-.7.2-1.4.3-.8.1-1 .1-3 .1s-2.2 0-3-.1c-.7-.1-1.1-.2-1.4-.3-.4-.1-.6-.3-.9-.6-.3-.3-.5-.5-.6-.9-.1-.3-.2-.7-.3-1.4-.1-.8-.1-1-.1-3s0-2.2.1-3c.1-.7.2-1.1.3-1.4.1-.4.3-.6.6-.9.3-.3.5-.5.9-.6.3-.1.7-.2 1.4-.3.8-.1 1-.1 3-.1m0-1.6c-2 0-2.3 0-3.1.1-.8 0-1.4.2-1.9.4-.5.2-.9.5-1.4.9-.4.4-.7.9-.9 1.4-.2.5-.3 1.1-.4 1.9 0 .8-.1 1.1-.1 3.1s0 2.3.1 3.1c0 .8.2 1.4.4 1.9.2.5.5.9.9 1.4.4.4.9.7 1.4.9.5.2 1.1.3 1.9.4.8 0 1.1.1 3.1.1s2.3 0 3.1-.1c.8 0 1.4-.2 1.9-.4.5-.2.9-.5 1.4-.9.4-.4.7-.9.9-1.4.2-.5.3-1.1.4-1.9 0-.8.1-1.1.1-3.1s0-2.3-.1-3.1c0-.8-.2-1.4-.4-1.9-.2-.5-.5-.9-.9-1.4-.4-.4-.9-.7-1.4-.9-.5-.2-1.1-.3-1.9-.4-.8 0-1.1-.1-3.1-.1z" fill="#FFFFFF"/>
      <path d="M12 8.2a3.8 3.8 0 100 7.6 3.8 3.8 0 000-7.6zm0 6.2a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm4.8-6.3a.9.9 0 11-1.8 0 .9.9 0 011.8 0z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#FF0000"/>
      <path d="M19.6 8.3c-.2-.7-.7-1.2-1.4-1.4C17 6.6 12 6.6 12 6.6s-5 0-6.2.3c-.7.2-1.2.7-1.4 1.4C4.1 9.5 4.1 12 4.1 12s0 2.5.3 3.7c.2.7.7 1.2 1.4 1.4 1.2.3 6.2.3 6.2.3s5 0 6.2-.3c.7-.2 1.2-.7 1.4-1.4.3-1.2.3-3.7.3-3.7s0-2.5-.3-3.7z" fill="#FFFFFF"/>
      <polygon points="10.4,14.5 14.8,12 10.4,9.5" fill="#FF0000"/>
    </svg>`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "messenger",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#25D366"/>
      <path d="M17.5 14.6c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1s-1.2-.4-2.2-1.3c-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.3 0-.5s-.6-1.5-.8-2c-.2-.5-.5-.5-.6-.5h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 4.2c-4.3 0-7.8 3.5-7.8 7.8 0 1.4.4 2.7 1.1 3.8L4.2 19.8l4.1-1.1c1.1.6 2.4 1 3.7 1 4.3 0 7.8-3.5 7.8-7.8S16.3 4.2 12 4.2z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "facebook",
    name: "Facebook",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#1877F2"/>
      <path d="M13.6 19.6v-6.9h2.3l.3-2.7h-2.6V8.3c0-.8.2-1.3 1.3-1.3h1.4V4.6c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v1.9H8.4v2.7h2.3v6.9h2.9z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#000000"/>
      <path d="M16.6 8.2c-1.1-.2-2-.8-2.5-1.7V14c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.4 0 .7.1 1.1.2V12c-.3-.1-.7-.2-1.1-.2-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2V4.8h2.2c.2 1.3 1.2 2.4 2.5 2.6l.6.1v2.1c-.4-.7-.9-1.2-1.4-1.4z" fill="#FFFFFF"/>
      <path d="M16.6 8.2c-.5.5-1.2.8-2 .9v.5c.8-.1 1.5-.4 2-.9l-.6-.5z" fill="#25F4EE"/>
      <path d="M16.6 8.2v-1.4c-.4.3-.9.6-1.5.7l.2.7h1.3z" fill="#FE2C55"/>
    </svg>`,
  },
  {
    id: "vk",
    name: "ВКонтакте",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#0077FF"/>
      <path d="M12.9 16.5c-4.4 0-6.9-3-7-8h2.2c.1 3.7 1.7 5.2 3 5.5V8.5h2.1v3.1c1.2-.1 2.6-1.6 3-3.1h2.1c-.4 2-1.8 3.5-2.8 4.1 1 .5 2.6 1.8 3.2 3.9h-2.3c-.6-1.6-1.9-2.9-3.2-3v3z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#0A66C2"/>
      <path d="M6.9 8.7h2.5V17H6.9V8.7zM8.2 5.1c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm3.1 3.6h2.4v1.1h0c.3-.6 1.1-1.3 2.3-1.3 2.5 0 2.9 1.6 2.9 3.8V17h-2.5v-4.1c0-1 0-2.2-1.4-2.2s-1.6 1.1-1.6 2.2V17h-2.5V8.7h.4z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#000000"/>
      <path d="M15.8 5.7h1.9l-4.2 4.8 4.9 6.5h-3.8l-3-3.9-3.4 3.9H6.3l4.5-5.1L6.1 5.7h3.9l2.7 3.6 3.1-3.6zm-.7 10.1h1.1L9.1 6.8H8l7.1 9z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "github",
    name: "GitHub",
    category: "service",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#24292E"/>
      <path d="M12 4.7C8 4.7 4.7 8 4.7 12c0 3.2 2.1 6 5 7 .4.1.5-.2.5-.4v-1.4c-2 .4-2.5-.9-2.5-.9-.3-.8-.8-1.1-.8-1.1-.7-.5 0-.5 0-.5.7.1 1.1.7 1.1.7.6 1.1 1.7.8 2.1.6.1-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.4.8-2-.1-.2-.3-.9.1-1.9 0 0 .6-.2 2 .7.6-.2 1.2-.2 1.8-.2s1.2.1 1.8.2c1.4-1 2-.7 2-.7.4 1 .2 1.7.1 1.9.5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.3.6.8.6 1.6v2.4c0 .2.2.5.5.4 2.9-1 5-3.8 5-7 0-4-3.3-7.3-7.3-7.3z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "appstore",
    name: "App Store",
    category: "service",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#0071E3"/>
      <path d="M13.2 13.9l.7 1.2-2.3 4h-1.5l1.8-3.1-2.9-5.1h1.5l2.1 3.8.6-.8zm3.6 5.2h-1.6l-1.3-2.3.8-1.4 2.1 3.7zm1.4-2.4l-1.6-2.7h-3.1l-.8-1.3h4.6l2.1 3.7-1.2.3zm-6-8l1.4 2.4-2.5 4.3H8.3l2.8-4.9-1.2-2.1h2.3z" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: "googleplay",
    name: "Google Play",
    category: "service",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#01875F"/>
      <path d="M5.5 5.2c-.1.2-.2.5-.2.9v11.8c0 .4.1.7.2.9l6.5-6.8-6.5-6.8zm7.3 6.8l2 2.1-7.8 4.4 5.8-6.5zm0 0L7 5.5l7.8 4.4-2 2.1zm.9.9l2.3-1.3c.7-.4.7-1.1 0-1.5l-2.3-1.3-1.1 1.2 1.1 2.9z" fill="#FFFFFF"/>
    </svg>`,
  },
];

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

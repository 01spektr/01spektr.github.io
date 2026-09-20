export type StyleCategory =
  | "all"
  | "popular"
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "monospace"
  | "aesthetic"
  | "bubbles"
  | "decorative"
  | "gothic"
  | "script";

export interface TextStyleItem {
  id: string;
  name: string;
  category: StyleCategory;
  transform: (text: string) => string;
  badge?: string;
}

export type SidebarCategoryType =
  | "styles"
  | "emoji"
  | "kaomoji"
  | "symbols"
  | "arrows"
  | "hearts"
  | "stars"
  | "frames"
  | "dividers"
  | "decorative"
  | "patterns"
  | "popular_symbols";

export interface SymbolItem {
  id: string;
  char: string;
  name: string;
  category: string;
  tags?: string[];
}

export interface KaomojiItem {
  id: string;
  text: string;
  name: string;
  category: string;
}

export type SocialPlatform =
  "instagram" | "telegram" | "twitter" | "tiktok" | "discord" | "vk" | "facebook" | "whatsapp";

export interface FavoriteItem {
  id: string;
  styleName: string;
  text: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  text: string;
  styleName: string;
  timestamp: number;
}

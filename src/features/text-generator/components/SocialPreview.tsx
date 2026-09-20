import React, { useState } from "react";
import { SocialPlatform } from "../types.ts";
import { useTranslation } from "../context/LanguageContext.tsx";
import { Check, Copy, Heart, MessageCircle, Share2, Eye, ThumbsUp } from "lucide-react";
import {
  InstagramIcon,
  TelegramIcon,
  TikTokIcon,
  DiscordIcon,
  VkIcon,
  TwitterIcon,
  FacebookIcon,
  WhatsAppIcon,
} from "./SocialIcons.tsx";

interface SocialPreviewProps {
  styledText: string;
  originalText: string;
  selectedStyleName: string;
  onCopyText: (text: string, label: string) => void;
}

interface PlatformTab {
  id: SocialPlatform;
  label: string;
  renderIcon: (className?: string) => React.ReactNode;
  brandColor: string;
}

const PLATFORMS: PlatformTab[] = [
  {
    id: "instagram",
    label: "Instagram",
    brandColor: "text-[#E1306C]",
    renderIcon: (className = "w-4 h-4") => <InstagramIcon className={className} />,
  },
  {
    id: "telegram",
    label: "Telegram",
    brandColor: "text-[#24A1DE]",
    renderIcon: (className = "w-4 h-4") => <TelegramIcon className={className} />,
  },
  {
    id: "tiktok",
    label: "TikTok",
    brandColor: "text-black",
    renderIcon: (className = "w-4 h-4") => <TikTokIcon className={className} />,
  },
  {
    id: "discord",
    label: "Discord",
    brandColor: "text-[#5865F2]",
    renderIcon: (className = "w-4 h-4") => <DiscordIcon className={className} />,
  },
  {
    id: "vk",
    label: "ВКонтакте",
    brandColor: "text-[#0077FF]",
    renderIcon: (className = "w-4 h-4") => <VkIcon className={className} />,
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    brandColor: "text-black",
    renderIcon: (className = "w-3.5 h-3.5") => <TwitterIcon className={className} />,
  },
  {
    id: "facebook",
    label: "Facebook",
    brandColor: "text-[#1877F2]",
    renderIcon: (className = "w-4 h-4") => <FacebookIcon className={className} />,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    brandColor: "text-[#25D366]",
    renderIcon: (className = "w-4 h-4") => <WhatsAppIcon className={className} />,
  },
];

export const SocialPreview: React.FC<SocialPreviewProps> = ({
  styledText,
  selectedStyleName,
  onCopyText,
}) => {
  const { t, lang } = useTranslation();
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>("instagram");
  const [copied, setCopied] = useState(false);

  const displayContent = styledText.trim() || "Toolboxi.uz — design tools for everyone";
  const copyTitle =
    lang === "uz" ? "Matnni nusxalash" : lang === "en" ? "Copy text" : "Копировать текст";
  const profileLabel = lang === "uz" ? "Profil" : lang === "en" ? "Profile" : "Профиль";
  const postLabel = lang === "uz" ? "Post" : lang === "en" ? "Post" : "Запись";
  const messageLabel = lang === "uz" ? "Xabar" : lang === "en" ? "Message" : "Сообщение";
  const agoThreeHours =
    lang === "uz" ? "uch soat oldin" : lang === "en" ? "three hours ago" : "три часа назад";
  const agoFiveMinutes =
    lang === "uz" ? "5 daqiqa oldin" : lang === "en" ? "5 min ago" : "5 мин назад";
  const todayAt =
    lang === "uz" ? "Bugun, 19:40 da" : lang === "en" ? "Today at 19:40" : "Сегодня, в 19:40";

  const handleCopy = () => {
    onCopyText(displayContent, t("social.title"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="social-preview-section" className="flex flex-col gap-3.5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white">
            {t("social.title")}
          </h2>
          <span className="text-xs font-semibold font-heading text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 px-2 py-0.5 rounded-md">
            {selectedStyleName}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
          {t("social.subtitle")}
        </p>
      </div>

      {/* Platform Selection Tabs with Real Logos */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl overflow-x-auto no-scrollbar">
        {PLATFORMS.map((p) => {
          const isActive = activePlatform === p.id;
          return (
            <button
              key={p.id}
              id={`tab-${p.id}`}
              type="button"
              onClick={() => setActivePlatform(p.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer font-heading flex items-center gap-1.5 ${
                isActive
                  ? "bg-blue-600 text-white shadow-2xs font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              <span
                className={
                  isActive
                    ? "text-white"
                    : p.id === "tiktok" || p.id === "twitter"
                      ? "text-black dark:text-white"
                      : p.brandColor
                }
              >
                {p.renderIcon("w-3.5 h-3.5 shrink-0")}
              </span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Preview Cards Container */}
      <div className="relative">
        {/* INSTAGRAM */}
        {activePlatform === "instagram" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-all">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xs">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                  Instagram Bio
                </span>
              </div>
              <button
                onClick={handleCopy}
                title={t("styles.copyBtn")}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-sm font-bold font-heading shadow-inner">
                  <InstagramIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 text-center">
                <div>
                  <div className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                    248
                  </div>
                  <div className="text-[11px] font-sans text-slate-400">
                    {t("social.mockup.posts")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                    12.4K
                  </div>
                  <div className="text-[11px] font-sans text-slate-400">
                    {t("social.mockup.followers")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                    356
                  </div>
                  <div className="text-[11px] font-sans text-slate-400">
                    {t("social.mockup.following")}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                toolboxi_design
              </div>
              <div className="text-xs text-slate-800 dark:text-slate-200 mt-1 break-words font-medium leading-relaxed font-sans">
                {displayContent}
              </div>
            </div>

            <button
              type="button"
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold font-heading text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {t("social.mockup.editProfile")}
            </button>
          </div>
        )}

        {/* TELEGRAM */}
        {activePlatform === "telegram" && (
          <div className="bg-[#5484ad]/10 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#24A1DE] text-white flex items-center justify-center shadow-2xs">
                  <TelegramIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                  Telegram Channel
                </span>
              </div>
              <button
                onClick={handleCopy}
                title={copyTitle}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="max-w-[92%] bg-white dark:bg-slate-800 rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold font-heading text-[#24A1DE] dark:text-[#38a9e4]">
                  Toolboxi News
                </span>
                <span className="text-[10px] text-blue-500">✓</span>
              </div>
              <div className="text-xs text-slate-800 dark:text-slate-100 break-words font-medium leading-relaxed font-sans">
                {displayContent}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1 font-sans">
                <span>15:42</span>
                <span className="text-[#24A1DE]">✓✓</span>
              </div>
            </div>
          </div>
        )}

        {/* TIKTOK */}
        {activePlatform === "tiktok" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-2xs">
                  <TikTokIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                  TikTok {profileLabel}
                </span>
              </div>
              <button
                onClick={handleCopy}
                title={copyTitle}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-3">
              <div className="w-16 h-16 rounded-full bg-black dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-white mb-1.5 shadow-xs">
                <TikTokIcon className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold font-heading text-slate-900 dark:text-white flex items-center gap-1">
                <span>@toolboxi</span>
                <span className="text-cyan-500 text-xs">✓</span>
              </div>
              <div className="flex items-center gap-4 text-center mt-2.5">
                <div>
                  <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                    89.2K
                  </span>
                  <p className="text-[10px] text-slate-400 font-sans">
                    {lang === "uz" ? "Layklar" : lang === "en" ? "Likes" : "Лайков"}
                  </p>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                    34.1K
                  </span>
                  <p className="text-[10px] text-slate-400 font-sans">
                    {t("social.mockup.followers")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2.5 mb-3 text-center border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-800 dark:text-slate-100 break-words font-medium leading-relaxed font-sans">
                {displayContent}
              </p>
            </div>

            <button
              type="button"
              className="w-full py-1.5 px-3 rounded-lg text-xs font-bold font-heading text-white bg-[#FE2C55] hover:bg-[#E0264B] transition-colors cursor-pointer"
            >
              {t("social.mockup.follow")}
            </button>
          </div>
        )}

        {/* DISCORD */}
        {activePlatform === "discord" && (
          <div className="bg-[#313338] text-[#DBDEE1] rounded-2xl p-4 shadow-xs border border-[#232428]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#3F4147]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#5865F2] text-white flex items-center justify-center shadow-2xs">
                  <DiscordIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold font-heading text-white">Discord Chat</span>
              </div>
              <button
                onClick={handleCopy}
                title={copyTitle}
                className="text-xs text-[#949BA4] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#5865F2] flex items-center justify-center text-white shrink-0">
                <DiscordIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold font-heading text-white hover:underline cursor-pointer">
                    Toolboxi Master
                  </span>
                  <span className="text-[9px] font-bold bg-[#5865F2] text-white px-1 py-0.2 rounded font-sans">
                    BOT
                  </span>
                  <span className="text-[10px] text-[#949BA4] font-sans">{todayAt}</span>
                </div>
                <div className="mt-1 text-xs text-[#DBDEE1] break-words font-sans leading-relaxed">
                  {displayContent}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VKONTAKTE */}
        {activePlatform === "vk" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#0077FF] text-white flex items-center justify-center shadow-2xs">
                  <VkIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                  ВКонтакте {postLabel}
                </span>
              </div>
              <button
                onClick={handleCopy}
                title={copyTitle}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0077FF] flex items-center justify-center text-white shrink-0">
                <VkIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold font-heading text-slate-900 dark:text-white flex items-center gap-1">
                  <span>
                    Toolboxi{" "}
                    {lang === "uz" ? "hamjamiyati" : lang === "en" ? "community" : "сообщество"}
                  </span>
                  <span className="text-[#0077FF] text-[11px]">✓</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">{agoThreeHours}</div>
              </div>
            </div>

            <div className="text-xs text-slate-800 dark:text-slate-200 break-words font-sans leading-relaxed mb-3">
              {displayContent}
            </div>

            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 font-sans">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-rose-600 cursor-pointer">
                  <Heart className="w-3.5 h-3.5" /> 84
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5" /> 16
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" /> 28
                </span>
              </div>
              <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Eye className="w-3.5 h-3.5" /> 1.9K
              </span>
            </div>
          </div>
        )}

        {/* X (TWITTER) */}
        {activePlatform === "twitter" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-2xs">
                  <TwitterIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                  X (Twitter) Post
                </span>
              </div>
              <button
                onClick={handleCopy}
                title={copyTitle}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-full bg-black dark:bg-slate-800 flex items-center justify-center text-white shrink-0">
                <TwitterIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                    Toolboxi
                  </span>
                  <span className="text-[11px] text-blue-500">✓</span>
                  <span className="text-[11px] text-slate-400 font-sans">
                    @toolboxi_uz · {lang === "uz" ? "1d" : lang === "en" ? "1m" : "1м"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-800 dark:text-slate-200 break-words font-sans leading-relaxed">
                  {displayContent}
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-sans mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>💬 18</span>
                  <span>🔁 42</span>
                  <span>❤️ 312</span>
                  <span>📊 5.2K</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FACEBOOK */}
        {activePlatform === "facebook" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shadow-2xs">
                  <FacebookIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                  Facebook {lang === "uz" ? "holati" : lang === "en" ? "Status" : "Статус"}
                </span>
              </div>
              <button
                onClick={handleCopy}
                title={copyTitle}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white shrink-0">
                <FacebookIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold font-heading text-slate-900 dark:text-white">
                  Toolboxi Official
                </div>
                <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                  <span>{agoFiveMinutes}</span>
                  <span>· 🌐</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-800 dark:text-slate-200 break-words font-sans leading-relaxed mb-3">
              {displayContent}
            </div>

            <div className="flex items-center justify-around text-slate-600 dark:text-slate-300 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 font-sans">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#1877F2] cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />{" "}
                {lang === "uz" ? "Yoqdi" : lang === "en" ? "Like" : "Нравится"}
              </button>
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#1877F2] cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />{" "}
                {lang === "uz" ? "Izoh" : lang === "en" ? "Comment" : "Комментарий"}
              </button>
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#1877F2] cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> {t("social.mockup.shareProfile")}
              </button>
            </div>
          </div>
        )}

        {/* WHATSAPP */}
        {activePlatform === "whatsapp" && (
          <div className="bg-[#EFEAE2] dark:bg-[#111B21] rounded-2xl p-4 shadow-xs border border-slate-200/90 dark:border-[#222E35]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-300/80 dark:border-[#222E35]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-2xs">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold font-heading text-slate-900 dark:text-slate-100">
                  WhatsApp {messageLabel}
                </span>
              </div>
              <button
                onClick={handleCopy}
                title={copyTitle}
                className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="max-w-[88%] ml-auto bg-[#D9FDD3] dark:bg-[#005C4B] rounded-xl rounded-tr-xs p-3 shadow-2xs border border-[#C2ECC0] dark:border-[#025144]">
              <div className="text-xs text-slate-900 dark:text-slate-100 break-words font-sans leading-relaxed">
                {displayContent}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-300 text-right mt-1 flex items-center justify-end gap-1 font-sans">
                <span>18:15</span>
                <span className="text-[#53BDEB]">✓✓</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

# Localization

Toolboxi uses one locale registry and one typed message file per language.

## Add a language

1. Add the locale metadata to `src/lib/i18n/config.ts`.
2. Copy `src/lib/i18n/messages/en.ts` to a new two-letter locale file and translate every value.
3. Import the file in `src/lib/i18n/messages/index.ts` and add it to `messages`.
4. The header and footer language menus update automatically from `LOCALES`.
5. Run `npm run check:i18n`, type checking, and the production build.

`ru.ts` is the source schema. TypeScript and `check:i18n.mjs` reject missing, extra, or duplicate keys. Browser language detection and fallback behavior live only in `src/lib/i18n/config.ts` and `src/lib/i18n.tsx`.

## Add tool copy

Use a stable namespace such as `tools.uuid.generate`. Add the key to every locale file in the same change and render it with `t("tools.uuid.generate")`. Do not add a new component-local language dictionary or inspect `locale` to choose visible strings.

// Unicode character transformation maps and helpers

// Basic ASCII ranges
const LATIN_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LATIN_LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

// Map characters using lookup string
function mapChars(text: string, fromChars: string, toChars: string[]): string {
  let res = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const idx = fromChars.indexOf(ch);
    if (idx !== -1 && idx < toChars.length) {
      res += toChars[idx];
    } else {
      res += ch;
    }
  }
  return res;
}

// Math Sans-Serif Bold
const BOLD_UPPER = [
  "𝗔",
  "𝗕",
  "𝗖",
  "𝗗",
  "𝗘",
  "𝗙",
  "𝗚",
  "𝗛",
  "𝗜",
  "𝗝",
  "𝗞",
  "𝗟",
  "𝗠",
  "𝗡",
  "𝗢",
  "𝗣",
  "𝗤",
  "𝗥",
  "𝗦",
  "𝗧",
  "𝗨",
  "𝗩",
  "𝗪",
  "𝗫",
  "𝗬",
  "𝗭",
];
const BOLD_LOWER = [
  "𝗮",
  "𝗯",
  "𝗰",
  "𝗱",
  "𝗲",
  "𝗳",
  "𝗴",
  "𝗵",
  "𝗶",
  "𝗷",
  "𝗸",
  "𝗹",
  "𝗺",
  "𝗻",
  "𝗼",
  "𝗽",
  "𝗾",
  "𝗿",
  "𝘀",
  "𝘁",
  "𝘂",
  "𝘃",
  "𝘄",
  "𝘅",
  "𝘆",
  "𝘇",
];
const BOLD_DIGITS = ["𝟬", "𝟭", "𝟮", "𝟯", "𝟰", "𝟱", "𝟲", "𝟳", "𝟴", "𝟵"];

// Math Serif Bold
const SERIF_BOLD_UPPER = [
  "𝐀",
  "𝐁",
  "𝐂",
  "𝐃",
  "𝐄",
  "𝐅",
  "𝐆",
  "𝐇",
  "𝐈",
  "𝐉",
  "𝐊",
  "𝐋",
  "𝐌",
  "𝐍",
  "𝐎",
  "𝐏",
  "𝐐",
  "𝐑",
  "𝐒",
  "𝐓",
  "𝐔",
  "𝐕",
  "𝐖",
  "𝐗",
  "𝐘",
  "𝐙",
];
const SERIF_BOLD_LOWER = [
  "𝐚",
  "𝐛",
  "𝐜",
  "𝐝",
  "𝐞",
  "𝐟",
  "𝐠",
  "𝐡",
  "𝐢",
  "𝐣",
  "𝐤",
  "𝐥",
  "𝐦",
  "𝐧",
  "𝐨",
  "𝐩",
  "𝐪",
  "𝐫",
  "𝐬",
  "𝐭",
  "𝐮",
  "𝐯",
  "𝐰",
  "𝐱",
  "𝐲",
  "𝐳",
];

// Math Sans-Serif Italic
const ITALIC_UPPER = [
  "𝘈",
  "𝘉",
  "𝘊",
  "𝘋",
  "𝘌",
  "𝘍",
  "𝘎",
  "𝘏",
  "𝘐",
  "𝘑",
  "𝘒",
  "𝘓",
  "𝘔",
  "𝘕",
  "𝘖",
  "𝘗",
  "𝘘",
  "𝘙",
  "𝘚",
  "𝘛",
  "𝘜",
  "𝘝",
  "𝘞",
  "𝘟",
  "𝘠",
  "𝘡",
];
const ITALIC_LOWER = [
  "𝘢",
  "𝘣",
  "𝘤",
  "𝘥",
  "𝘦",
  "𝘧",
  "𝘨",
  "𝘩",
  "𝘪",
  "𝘫",
  "𝘬",
  "𝘭",
  "𝘮",
  "𝘯",
  "𝘰",
  "𝘱",
  "𝘲",
  "𝘳",
  "𝘴",
  "𝘵",
  "𝘶",
  "𝘷",
  "𝘸",
  "𝘹",
  "𝘺",
  "𝘻",
];

// Math Sans-Serif Bold Italic
const BOLD_ITALIC_UPPER = [
  "𝘼",
  "𝘽",
  "𝘾",
  "𝘿",
  "𝙀",
  "𝙁",
  "𝙂",
  "𝙃",
  "𝙄",
  "𝙅",
  "𝙆",
  "𝙇",
  "𝙈",
  "𝙉",
  "𝙊",
  "𝙋",
  "𝙌",
  "𝙍",
  "𝙎",
  "𝙏",
  "𝙐",
  "𝙑",
  "𝙒",
  "𝙓",
  "𝙔",
  "𝙕",
];
const BOLD_ITALIC_LOWER = [
  "𝙖",
  "𝙗",
  "𝙘",
  "𝙙",
  "𝙚",
  "𝙛",
  "𝙜",
  "𝙝",
  "𝙞",
  "𝙟",
  "𝙠",
  "𝙡",
  "𝙢",
  "𝙣",
  "𝙤",
  "𝙥",
  "𝙦",
  "𝙧",
  "𝙨",
  "𝙩",
  "𝙪",
  "𝙫",
  "𝙬",
  "𝙭",
  "𝙮",
  "𝙯",
];

// Monospace / Typewriter
const MONO_UPPER = [
  "𝙰",
  "𝙱",
  "𝙲",
  "𝙳",
  "𝙴",
  "𝙵",
  "𝙶",
  "𝙷",
  "𝙸",
  "𝙹",
  "𝙺",
  "𝙻",
  "𝙼",
  "𝙽",
  "𝙾",
  "𝙿",
  "𝚀",
  "𝚁",
  "𝚂",
  "𝚃",
  "𝚄",
  "𝚅",
  "𝚆",
  "𝚇",
  "𝚈",
  "𝚉",
];
const MONO_LOWER = [
  "𝚊",
  "𝚋",
  "𝚌",
  "𝚍",
  "𝚎",
  "𝚏",
  "𝚐",
  "𝚑",
  "𝚒",
  "𝚓",
  "𝚔",
  "𝚕",
  "𝚖",
  "𝚗",
  "𝚘",
  "𝚙",
  "𝚚",
  "𝚛",
  "𝚜",
  "𝚝",
  "𝚞",
  "𝚟",
  "𝚠",
  "𝚡",
  "𝚢",
  "𝚣",
];
const MONO_DIGITS = ["𝟶", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿"];

// Circled / Bubble
const BUBBLE_UPPER = [
  "Ⓐ",
  "Ⓑ",
  "Ⓒ",
  "Ⓓ",
  "Ⓔ",
  "Ⓕ",
  "Ⓖ",
  "Ⓗ",
  "Ⓘ",
  "Ⓙ",
  "Ⓚ",
  "Ⓛ",
  "Ⓜ",
  "Ⓝ",
  "Ⓞ",
  "Ⓟ",
  "Ⓠ",
  "Ⓡ",
  "Ⓢ",
  "Ⓣ",
  "Ⓤ",
  "Ⓥ",
  "Ⓦ",
  "Ⓧ",
  "Ⓨ",
  "Ⓩ",
];
const BUBBLE_LOWER = [
  "ⓐ",
  "ⓑ",
  "ⓒ",
  "ⓓ",
  "ⓔ",
  "ⓕ",
  "ⓖ",
  "ⓗ",
  "ⓘ",
  "ⓙ",
  "ⓚ",
  "ⓛ",
  "ⓜ",
  "ⓝ",
  "ⓞ",
  "ⓟ",
  "ⓠ",
  "ⓡ",
  "ⓢ",
  "ⓣ",
  "ⓤ",
  "ⓥ",
  "ⓦ",
  "ⓧ",
  "ⓨ",
  "ⓩ",
];
const BUBBLE_DIGITS = ["⓪", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];

// Inverted Circled / Dark Bubble
const DARK_BUBBLE_UPPER = [
  "🅐",
  "🅑",
  "🅒",
  "🅓",
  "🅔",
  "🅕",
  "🅖",
  "🅗",
  "🅘",
  "🅙",
  "🅚",
  "🅛",
  "🅜",
  "🅝",
  "🅞",
  "🅟",
  "🅠",
  "🅡",
  "🅢",
  "🅣",
  "🅤",
  "🅥",
  "🅦",
  "🅧",
  "🅨",
  "🅩",
];
const DARK_BUBBLE_DIGITS = ["⓿", "➊", "➋", "➌", "➍", "➎", "➏", "➐", "➑", "➒"];

// Squared
const SQUARED_UPPER = [
  "🄰",
  "🄱",
  "🄲",
  "🄳",
  "🄴",
  "🄵",
  "🄶",
  "🄷",
  "🄸",
  "🄹",
  "🄺",
  "🄻",
  "🄼",
  "🄽",
  "🄾",
  "🄿",
  "🅀",
  "🅁",
  "🅂",
  "🅃",
  "🅄",
  "🅅",
  "🅆",
  "🅇",
  "🅈",
  "🅉",
];

// Dark Squared
const DARK_SQUARED_UPPER = [
  "🅰",
  "🅱",
  "🅲",
  "🅳",
  "🅴",
  "🅵",
  "🅶",
  "🅷",
  "🅸",
  "🅹",
  "🅺",
  "🅻",
  "🅼",
  "🅽",
  "🅾",
  "🅿",
  "🆀",
  "🆁",
  "🆂",
  "🆃",
  "🆄",
  "🆅",
  "🆆",
  "🆇",
  "🆈",
  "🆉",
];

// Double Struck / Blackboard Bold
const DOUBLE_UPPER = [
  "𝔸",
  "𝔹",
  "ℂ",
  "𝔻",
  "𝔼",
  "𝔽",
  "𝔾",
  "ℍ",
  "𝕀",
  "𝕁",
  "𝕂",
  "𝕃",
  "𝕄",
  "ℕ",
  "𝕆",
  "ℙ",
  "ℚ",
  "ℝ",
  "𝕊",
  "𝕋",
  "𝕌",
  "𝕍",
  "𝕎",
  "𝕏",
  "𝕐",
  "ℤ",
];
const DOUBLE_LOWER = [
  "𝕒",
  "𝕓",
  "𝕔",
  "𝕕",
  "𝕖",
  "𝕗",
  "𝕘",
  "𝕙",
  "𝕚",
  "𝕛",
  "𝕜",
  "𝕝",
  "𝕞",
  "𝕟",
  "𝕠",
  "𝕡",
  "𝕢",
  "𝕣",
  "𝕤",
  "𝕥",
  "𝕦",
  "𝕧",
  "𝕨",
  "𝕩",
  "𝕪",
  "𝕫",
];
const DOUBLE_DIGITS = ["𝟘", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡"];

// Gothic / Fraktur
const GOTHIC_UPPER = [
  "𝔄",
  "𝔅",
  "ℭ",
  "𝔇",
  "𝔈",
  "𝔉",
  "𝔊",
  "ℌ",
  "ℑ",
  "𝔍",
  "𝔎",
  "𝔏",
  "𝔐",
  "𝔑",
  "𝔒",
  "𝔓",
  "𝔔",
  "ℜ",
  "𝔖",
  "𝔗",
  "𝔘",
  "𝔙",
  "𝔚",
  "𝔛",
  "𝔜",
  "ℨ",
];
const GOTHIC_LOWER = [
  "𝔞",
  "𝔟",
  "𝔠",
  "𝔡",
  "𝔢",
  "𝔣",
  "𝔤",
  "𝔥",
  "𝔦",
  "𝔧",
  "𝔨",
  "𝔩",
  "𝔪",
  "𝔫",
  "𝔬",
  "𝔭",
  "𝔮",
  "𝔯",
  "𝔰",
  "𝔱",
  "𝔲",
  "𝔳",
  "𝔴",
  "𝔵",
  "𝔶",
  "𝔷",
];

// Bold Fraktur
const BOLD_GOTHIC_UPPER = [
  "𝕬",
  "𝕭",
  "𝕮",
  "𝕯",
  "𝕰",
  "𝕱",
  "𝕲",
  "𝕳",
  "𝕴",
  "𝕵",
  "𝕶",
  "𝕷",
  "𝕸",
  "𝕹",
  "𝕺",
  "𝕻",
  "𝕼",
  "𝕽",
  "𝕾",
  "𝕿",
  "𝖀",
  "𝖁",
  "𝖂",
  "𝖃",
  "𝖄",
  "𝖅",
];
const BOLD_GOTHIC_LOWER = [
  "𝖆",
  "𝖇",
  "𝖈",
  "𝖉",
  "𝖊",
  "𝖋",
  "𝖌",
  "𝖍",
  "𝖎",
  "𝖏",
  "𝖐",
  "𝖑",
  "𝖒",
  "𝖓",
  "𝖔",
  "𝖕",
  "𝖖",
  "𝖗",
  "𝖘",
  "𝖙",
  "𝖚",
  "𝖛",
  "𝖜",
  "𝖝",
  "𝖞",
  "𝖟",
];

// Script / Cursive
const SCRIPT_UPPER = [
  "𝒜",
  "ℬ",
  "𝒞",
  "𝒟",
  "ℰ",
  "ℱ",
  "𝒢",
  "ℋ",
  "ℐ",
  "𝒥",
  "𝒦",
  "ℒ",
  "ℳ",
  "𝒩",
  "𝒪",
  "𝒫",
  "𝒬",
  "ℛ",
  "𝒮",
  "𝒯",
  "𝒰",
  "𝒱",
  "𝒲",
  "𝒳",
  "𝒴",
  "𝒵",
];
const SCRIPT_LOWER = [
  "𝒶",
  "𝒷",
  "𝒸",
  "𝒹",
  "ℯ",
  "𝒻",
  "ℊ",
  "𝒽",
  "𝒾",
  "𝒿",
  "𝓀",
  "𝓁",
  "𝓂",
  "𝓃",
  "ℴ",
  "𝓅",
  "𝓆",
  "𝓇",
  "𝓈",
  "𝓉",
  "𝓊",
  "𝓋",
  "𝓌",
  "𝓍",
  "𝓎",
  "𝓏",
];

// Bold Script
const BOLD_SCRIPT_UPPER = [
  "𝓐",
  "𝓑",
  "𝓒",
  "𝓓",
  "𝓔",
  "𝓕",
  "𝓖",
  "𝓗",
  "𝓘",
  "𝓙",
  "𝓚",
  "𝓛",
  "𝓜",
  "𝓝",
  "𝓞",
  "𝓟",
  "𝓠",
  "𝓡",
  "𝓢",
  "𝓣",
  "𝓤",
  "𝓥",
  "𝓦",
  "𝓧",
  "𝓨",
  "𝓩",
];
const BOLD_SCRIPT_LOWER = [
  "𝓪",
  "𝓫",
  "𝓬",
  "𝓭",
  "𝓮",
  "𝓯",
  "𝓰",
  "𝓱",
  "𝓲",
  "𝓳",
  "𝓴",
  "𝓵",
  "𝓶",
  "𝓷",
  "𝓸",
  "𝓹",
  "𝓺",
  "𝓻",
  "𝓼",
  "𝓽",
  "𝙪",
  "𝓿",
  "𝓬",
  "𝔁",
  "𝔂",
  "𝔃",
];

// Small Caps
const SMALL_CAPS_MAP: Record<string, string> = {
  a: "ᴀ",
  b: "ʙ",
  c: "ᴄ",
  d: "ᴅ",
  e: "ᴇ",
  f: "ғ",
  g: "ɢ",
  h: "ʜ",
  i: "ɪ",
  j: "ᴊ",
  k: "ᴋ",
  l: "ʟ",
  m: "ᴍ",
  n: "ɴ",
  o: "ᴏ",
  p: "ᴘ",
  q: "ǫ",
  r: "ʀ",
  s: "s",
  t: "ᴛ",
  u: "ᴜ",
  v: "ᴠ",
  w: "ᴡ",
  x: "x",
  y: "ʏ",
  z: "ᴢ",
  а: "ᴀ",
  б: "б",
  в: "в",
  г: "г",
  д: "д",
  е: "ᴇ",
  ж: "ж",
  з: "з",
  и: "и",
  й: "й",
  к: "ᴋ",
  л: "л",
  м: "ᴍ",
  н: "н",
  о: "ᴏ",
  п: "п",
  р: "ᴘ",
  с: "с",
  т: "ᴛ",
  у: "ʏ",
  ф: "ф",
  х: "x",
  ц: "ц",
  ч: "ч",
  ш: "ш",
  щ: "щ",
  ъ: "ъ",
  ы: "ы",
  ь: "ь",
  э: "э",
  ю: "ю",
  я: "я",
};

// Upside down map
const FLIP_MAP: Record<string, string> = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "ן",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  A: "∀",
  B: "𐐒",
  C: "Ɔ",
  D: "ᗡ",
  E: "Ǝ",
  F: "Ⅎ",
  G: "⅁",
  H: "H",
  I: "I",
  J: "ſ",
  K: "ʞ",
  L: "˥",
  M: "W",
  N: "N",
  O: "O",
  P: "Ԁ",
  Q: "Ὁ",
  R: "ᴚ",
  S: "S",
  T: "⊥",
  U: "∩",
  V: "Λ",
  W: "M",
  X: "X",
  Y: "⅄",
  Z: "Z",
  "1": "Ɩ",
  "2": "ᄅ",
  "3": "Ɛ",
  "4": "ㄣ",
  "5": "ϛ",
  "6": "9",
  "7": "ㄥ",
  "8": "8",
  "9": "6",
  "0": "0",
  ".": "˙",
  ",": "'",
  "'": ",",
  '"': "„",
  "!": "¡",
  "?": "¿",
  "<": ">",
  ">": "<",
  "[": "]",
  "]": "[",
  "(": ")",
  ")": "(",
  "{": "}",
  "}": "{",
  "&": "⅋",
  _: "‾",
  ";": "؛",
};

// Fullwidth / Aesthetic
function toFullwidth(text: string): string {
  let res = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 33 && code <= 126) {
      res += String.fromCharCode(code + 0xfee0);
    } else if (code === 32) {
      res += "  "; // wide space
    } else {
      res += text[i];
    }
  }
  return res;
}

// Combining mark helper
function addCombiningMark(text: string, mark: string): string {
  return text
    .split("")
    .map((char) => (char === " " ? " " : char + mark))
    .join("");
}

// Transform functions
export const transformFunctions = {
  plain: (text: string) => text,

  bold: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, BOLD_UPPER);
    s = mapChars(s, LATIN_LOWER, BOLD_LOWER);
    s = mapChars(s, DIGITS, BOLD_DIGITS);
    return s;
  },

  serifBold: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, SERIF_BOLD_UPPER);
    s = mapChars(s, LATIN_LOWER, SERIF_BOLD_LOWER);
    return s;
  },

  italic: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, ITALIC_UPPER);
    s = mapChars(s, LATIN_LOWER, ITALIC_LOWER);
    return s;
  },

  boldItalic: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, BOLD_ITALIC_UPPER);
    s = mapChars(s, LATIN_LOWER, BOLD_ITALIC_LOWER);
    return s;
  },

  underline: (text: string) => addCombiningMark(text, "\u0332"),
  doubleUnderline: (text: string) => addCombiningMark(text, "\u0333"),
  strikethrough: (text: string) => addCombiningMark(text, "\u0336"),
  slashThrough: (text: string) => addCombiningMark(text, "\u0338"),
  crossThrough: (text: string) => addCombiningMark(text, "\u0337"),

  monospace: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, MONO_UPPER);
    s = mapChars(s, LATIN_LOWER, MONO_LOWER);
    s = mapChars(s, DIGITS, MONO_DIGITS);
    return s;
  },

  bubbles: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, BUBBLE_UPPER);
    s = mapChars(s, LATIN_LOWER, BUBBLE_LOWER);
    s = mapChars(s, DIGITS, BUBBLE_DIGITS);
    return s;
  },

  darkBubbles: (text: string) => {
    const upperText = text.toUpperCase();
    let s = mapChars(upperText, LATIN_UPPER, DARK_BUBBLE_UPPER);
    s = mapChars(s, DIGITS, DARK_BUBBLE_DIGITS);
    return s;
  },

  squared: (text: string) => {
    const upperText = text.toUpperCase();
    return mapChars(upperText, LATIN_UPPER, SQUARED_UPPER);
  },

  darkSquared: (text: string) => {
    const upperText = text.toUpperCase();
    return mapChars(upperText, LATIN_UPPER, DARK_SQUARED_UPPER);
  },

  flipped: (text: string) => {
    return text
      .split("")
      .reverse()
      .map((ch) => FLIP_MAP[ch] || ch)
      .join("");
  },

  smallCaps: (text: string) => {
    return text
      .split("")
      .map((ch) => {
        const lower = ch.toLowerCase();
        return SMALL_CAPS_MAP[lower] || ch;
      })
      .join("");
  },

  aesthetic: (text: string) => {
    const italicized = transformFunctions.italic(text);
    return `✦ ${italicized} ✦`;
  },

  fullwidth: (text: string) => toFullwidth(text),

  double: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, DOUBLE_UPPER);
    s = mapChars(s, LATIN_LOWER, DOUBLE_LOWER);
    s = mapChars(s, DIGITS, DOUBLE_DIGITS);
    return s;
  },

  decorative: (text: string) => `✂ ${text} ✂`,
  sparkles: (text: string) => `✧･ﾟ: *✧ ${text} ✧*:･ﾟ✧`,
  hearts: (text: string) => `♡ ${text} ♡`,
  loveWings: (text: string) => `ღ ${text} ღ`,
  floral: (text: string) => `✿ ${text} ✿`,
  stars: (text: string) => `★ ${text} ★`,
  wings: (text: string) => `꧁ ${text} ꧂`,
  royal: (text: string) => `♚ ${text} ♚`,
  gothic: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, GOTHIC_UPPER);
    s = mapChars(s, LATIN_LOWER, GOTHIC_LOWER);
    return s;
  },

  boldGothic: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, BOLD_GOTHIC_UPPER);
    s = mapChars(s, LATIN_LOWER, BOLD_GOTHIC_LOWER);
    return s;
  },

  script: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, SCRIPT_UPPER);
    s = mapChars(s, LATIN_LOWER, SCRIPT_LOWER);
    return s;
  },

  boldScript: (text: string) => {
    let s = mapChars(text, LATIN_UPPER, BOLD_SCRIPT_UPPER);
    s = mapChars(s, LATIN_LOWER, BOLD_SCRIPT_LOWER);
    return s;
  },

  japaneseBrackets: (text: string) => `【 ${text} 】`,
  cornerBrackets: (text: string) => `『 ${text} 』`,
  diamondBrackets: (text: string) => `◈ ${text} ◈`,
  arrowDecor: (text: string) => `» ${text} «`,
  waveDecor: (text: string) => `〰 ${text} 〰`,
  wavyUnderline: (text: string) => addCombiningMark(text, "\u0330"),

  superscript: (text: string) => {
    const superMap: Record<string, string> = {
      "0": "⁰",
      "1": "¹",
      "2": "²",
      "3": "³",
      "4": "⁴",
      "5": "⁵",
      "6": "⁶",
      "7": "⁷",
      "8": "⁸",
      "9": "⁹",
      a: "ᵃ",
      b: "ᵇ",
      c: "ᶜ",
      d: "ᵈ",
      e: "ᵉ",
      f: "ᶠ",
      g: "ᵍ",
      h: "ʰ",
      i: "ⁱ",
      j: "ʲ",
      k: "ᵏ",
      l: "ˡ",
      m: "ᵐ",
      n: "ⁿ",
      o: "ᵒ",
      p: "ᵖ",
      r: "ʳ",
      s: "ˢ",
      t: "ᵗ",
      u: "ᵘ",
      v: "ᵛ",
      w: "ʷ",
      x: "ˣ",
      y: "ʸ",
      z: "ᶻ",
      A: "ᴬ",
      B: "ᴮ",
      D: "ᴰ",
      E: "ᴱ",
      G: "ᴳ",
      H: "ᴴ",
      I: "ᴵ",
      J: "ᴶ",
      K: "ᴷ",
      L: "ᴸ",
      M: "ᴹ",
      N: "ᴺ",
      O: "ᴼ",
      P: "ᴾ",
      R: "ᴿ",
      T: "ᵀ",
      U: "ᵁ",
      W: "ᵂ",
    };
    return text
      .split("")
      .map((ch) => superMap[ch] || ch)
      .join("");
  },

  subscript: (text: string) => {
    const subMap: Record<string, string> = {
      "0": "₀",
      "1": "₁",
      "2": "₂",
      "3": "₃",
      "4": "₄",
      "5": "₅",
      "6": "₆",
      "7": "₇",
      "8": "₈",
      "9": "₉",
      a: "ₐ",
      e: "ₑ",
      h: "ₕ",
      i: "ᵢ",
      j: "ⱼ",
      k: "ₖ",
      l: "ₗ",
      m: "ₘ",
      n: "ₙ",
      o: "ₒ",
      p: "ₚ",
      r: "ᵣ",
      s: "ₛ",
      t: "ₜ",
      u: "ᵤ",
      v: "ᵥ",
      x: "ₓ",
    };
    return text
      .split("")
      .map((ch) => subMap[ch] || ch)
      .join("");
  },

  glitch: (text: string) => {
    const glitchMarks = [
      "\u0300",
      "\u0301",
      "\u0302",
      "\u0303",
      "\u0308",
      "\u0334",
      "\u0335",
      "\u0336",
      "\u0338",
    ];
    return text
      .split("")
      .map((ch, idx) => {
        if (ch === " ") return " ";
        const mark = glitchMarks[idx % glitchMarks.length];
        return ch + mark;
      })
      .join("");
  },
};

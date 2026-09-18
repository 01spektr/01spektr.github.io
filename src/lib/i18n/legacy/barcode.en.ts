export const BARCODE_COLOR_LABELS_EN: Record<string, string> = {
  black: "Black",
  navy: "Dark blue",
  slate: "Dark grey",
  green: "Green",
  red: "Red",
  custom: "Custom colour…",
};

export const BARCODE_SIZE_LABELS_EN: Record<string, string> = {
  small: "Small (200 px)",
  medium: "Medium (300 px)",
  large: "Large (450 px)",
  xlarge: "Extra large (600 px)",
};

export const BARCODE_DESCRIPTIONS_EN: Record<string, string> = {
  "EAN-13": "Standard 13-digit code used for retail products.",
  "EAN-8": "Compact 8-digit code for small packages.",
  Code128: "High-density code for letters, numbers and symbols.",
  Code39: "Popular industrial barcode for Latin letters and numbers.",
  "ITF-14": "Barcode for shipping packages and cardboard boxes.",
  "UPC-A": "American 12-digit retail barcode standard.",
  Codabar: "Simple barcode used by libraries, laboratories and logistics.",
};

export const BARCODE_HINTS_EN: Record<string, string> = {
  "EAN-13": "Enter 12 or 13 digits; the check digit is calculated automatically.",
  "EAN-8": "Enter 7 or 8 digits.",
  Code128: "Supports Latin letters, numbers and special characters.",
  Code39: "Supports uppercase Latin letters, numbers and - . $ / + %.",
  "ITF-14": "Enter exactly 13 or 14 digits.",
  "UPC-A": "Enter 11 or 12 digits.",
  Codabar: "Supports digits and the symbols - $ : / . +.",
};

export const BARCODE_FORMATS_EN: Record<
  string,
  { description: string; usage: string; hint: string }
> = {
  "EAN-13": {
    description: "The international retail product identifier used worldwide.",
    usage: "Retail, supermarkets and finished consumer goods.",
    hint: "Enter 12 or 13 digits; the check digit is calculated automatically.",
  },
  "EAN-8": {
    description: "A compact EAN format for products with limited label space.",
    usage: "Small retail items, bottles and blister packs.",
    hint: "Enter 7 or 8 digits.",
  },
  Code128: {
    description: "A high-density variable-length barcode supporting the full ASCII character set.",
    usage: "Logistics, shipping labels, serial numbers and inventory.",
    hint: "Use Latin letters, digits and ASCII symbols.",
  },
  Code39: {
    description: "A reliable industrial barcode for uppercase Latin letters, digits and a small symbol set.",
    usage: "Industrial assets, automotive and inventory control.",
    hint: "Use uppercase Latin letters, digits and - . $ / + %.",
  },
  "ITF-14": {
    description: "A 14-digit shipping-container barcode designed for corrugated packaging.",
    usage: "Wholesale boxes, pallets and shipping containers.",
    hint: "Enter exactly 13 or 14 digits.",
  },
  "UPC-A": {
    description: "The 12-digit retail product standard used in the United States and Canada.",
    usage: "Products intended for the US and Canadian retail markets.",
    hint: "Enter 11 or 12 digits.",
  },
  Codabar: {
    description: "A simple discrete barcode with A–D start and stop characters.",
    usage: "Libraries, laboratories and courier documents.",
    hint: "Start and end with A, B, C or D.",
  },
  default: {
    description: "Barcode standard.",
    usage: "Product and logistics identification.",
    hint: "Enter valid barcode data.",
  },
};

export function translateBarcodeRuntimeMessage(message: string) {
  return message
    .replace("Введите данные для штрихкода", "Enter barcode data")
    .replace(/Введено (\d+) из (\d+) цифр\./, "Entered $1 of $2 digits.")
    .replace(/Для (EAN-13|EAN-8|ITF-14) требуется/, "$1 requires")
    .replace(
      /13-я цифра '(.+)' неверна по стандарту GS1\. Для кодирования использована верная контрольная сумма '(.+)'\./,
      "The 13th digit '$1' is invalid under GS1. The correct check digit '$2' is used for encoding.",
    )
    .replace(/8-я цифра '(.+)' скорректирована на верную сумму '(.+)'\./, "The 8th digit '$1' was corrected to '$2'.")
    .replace(/14-я контрольная цифра скорректирована на '(.+)'\./, "The 14th check digit was corrected to '$1'.")
    .replace(/Ошибка формата данных для (.+)\. Проверьте введенные символы\./, "Invalid $1 data. Check the entered characters.");
}

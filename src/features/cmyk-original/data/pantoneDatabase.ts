import { PantoneColor } from '../types';
import { rgbToLab } from '../utils/colorConversion';

interface RawPantone {
  code: string;
  name: string;
  category: 'coated' | 'uncoated' | 'metallic' | 'pastel';
  hex: string;
  rgb: [number, number, number];
  cmyk: [number, number, number, number];
}

const RAW_PANTONES: RawPantone[] = [
  // Blues & Cyans
  { code: 'PANTONE 2174 C', name: 'Royal Blue', category: 'coated', hex: '#2563EB', rgb: [37, 99, 235], cmyk: [84, 58, 0, 8] },
  { code: 'PANTONE 286 C', name: 'True Blue', category: 'coated', hex: '#0033A0', rgb: [0, 51, 160], cmyk: [100, 75, 0, 0] },
  { code: 'PANTONE 285 C', name: 'Dodger Blue', category: 'coated', hex: '#0072CE', rgb: [0, 114, 206], cmyk: [90, 48, 0, 0] },
  { code: 'PANTONE 293 C', name: 'Cobalt Blue', category: 'coated', hex: '#0051BA', rgb: [0, 81, 186], cmyk: [100, 69, 0, 4] },
  { code: 'PANTONE 300 C', name: 'Bright Blue', category: 'coated', hex: '#005EB8', rgb: [0, 94, 184], cmyk: [100, 44, 0, 0] },
  { code: 'PANTONE 2925 C', name: 'Sky Cerulean', category: 'coated', hex: '#009CDE', rgb: [0, 156, 222], cmyk: [85, 24, 0, 0] },
  { code: 'PANTONE Reflex Blue C', name: 'Reflex Blue', category: 'coated', hex: '#0A1172', rgb: [10, 17, 114], cmyk: [100, 89, 0, 0] },
  { code: 'PANTONE Process Blue C', name: 'Process Blue', category: 'coated', hex: '#0085CA', rgb: [0, 133, 202], cmyk: [100, 13, 1, 3] },
  { code: 'PANTONE 2728 C', name: 'Electric Indigo', category: 'coated', hex: '#1C3BB8', rgb: [28, 59, 184], cmyk: [96, 69, 0, 2] },
  { code: 'PANTONE 2144 C', name: 'Sapphire', category: 'coated', hex: '#1E40AF', rgb: [30, 64, 175], cmyk: [92, 70, 0, 2] },
  { code: 'PANTONE 298 C', name: 'Light Cyan', category: 'coated', hex: '#41B6E6', rgb: [65, 182, 230], cmyk: [67, 2, 0, 0] },
  { code: 'PANTONE 312 C', name: 'Aqua Blue', category: 'coated', hex: '#00A3E0', rgb: [0, 163, 224], cmyk: [89, 0, 11, 0] },
  { code: 'PANTONE 319 C', name: 'Robin Egg', category: 'coated', hex: '#2DCCD3', rgb: [45, 204, 211], cmyk: [63, 0, 19, 0] },
  { code: 'PANTONE 326 C', name: 'Vibrant Teal', category: 'coated', hex: '#00B2A9', rgb: [0, 178, 169], cmyk: [81, 0, 39, 0] },
  { code: 'PANTONE 320 C', name: 'Deep Teal', category: 'coated', hex: '#009CA6', rgb: [0, 156, 166], cmyk: [100, 0, 31, 23] },
  { code: 'PANTONE 2767 C', name: 'Midnight Navy', category: 'coated', hex: '#131E3A', rgb: [19, 30, 58], cmyk: [100, 90, 10, 77] },
  { code: 'PANTONE 289 C', name: 'Classic Navy', category: 'coated', hex: '#0C2340', rgb: [12, 35, 64], cmyk: [100, 76, 12, 70] },
  { code: 'PANTONE 280 C', name: 'Deep Navy Blue', category: 'coated', hex: '#012169', rgb: [1, 33, 105], cmyk: [100, 85, 5, 22] },

  // Reds & Pinks
  { code: 'PANTONE 185 C', name: 'Signal Red', category: 'coated', hex: '#E4002B', rgb: [228, 0, 43], cmyk: [0, 100, 79, 0] },
  { code: 'PANTONE 485 C', name: 'True Red', category: 'coated', hex: '#DA291C', rgb: [218, 41, 28], cmyk: [0, 95, 100, 0] },
  { code: 'PANTONE Warm Red C', name: 'Warm Red', category: 'coated', hex: '#F93822', rgb: [249, 56, 34], cmyk: [0, 83, 80, 0] },
  { code: 'PANTONE Red 032 C', name: 'Scarlet Red', category: 'coated', hex: '#EF3340', rgb: [239, 51, 64], cmyk: [0, 90, 62, 0] },
  { code: 'PANTONE 199 C', name: 'Crimson', category: 'coated', hex: '#D50032', rgb: [213, 0, 50], cmyk: [0, 100, 72, 0] },
  { code: 'PANTONE 200 C', name: 'Cherry Red', category: 'coated', hex: '#BA0C2F', rgb: [186, 12, 47], cmyk: [3, 100, 70, 12] },
  { code: 'PANTONE 186 C', name: 'Cardinal Red', category: 'coated', hex: '#C8102E', rgb: [200, 16, 46], cmyk: [2, 100, 85, 6] },
  { code: 'PANTONE 201 C', name: 'Maroon', category: 'coated', hex: '#9D2235', rgb: [157, 34, 53], cmyk: [7, 100, 68, 32] },
  { code: 'PANTONE 1925 C', name: 'Watermelon', category: 'coated', hex: '#E03C31', rgb: [224, 60, 49], cmyk: [0, 87, 72, 0] },
  { code: 'PANTONE Rubine Red C', name: 'Rubine Red', category: 'coated', hex: '#CE0058', rgb: [206, 0, 88], cmyk: [0, 100, 15, 4] },
  { code: 'PANTONE Rhodamine Red C', name: 'Rhodamine Red', category: 'coated', hex: '#E10098', rgb: [225, 0, 152], cmyk: [3, 93, 0, 0] },
  { code: 'PANTONE 219 C', name: 'Barbie Magenta', category: 'coated', hex: '#DA1884', rgb: [218, 24, 132], cmyk: [1, 92, 1, 0] },
  { code: 'PANTONE 238 C', name: 'Fuchsia Pink', category: 'coated', hex: '#E74C97', rgb: [231, 76, 151], cmyk: [0, 81, 4, 0] },
  { code: 'PANTONE 709 C', name: 'Soft Rose', category: 'coated', hex: '#F05869', rgb: [240, 88, 105], cmyk: [0, 74, 42, 0] },

  // Greens & Emeralds
  { code: 'PANTONE 354 C', name: 'Shamrock Green', category: 'coated', hex: '#00B140', rgb: [0, 177, 64], cmyk: [80, 0, 90, 0] },
  { code: 'PANTONE Green C', name: 'Pure Green', category: 'coated', hex: '#00AB84', rgb: [0, 171, 132], cmyk: [100, 0, 59, 0] },
  { code: 'PANTONE 360 C', name: 'Lime Green', category: 'coated', hex: '#6CC24A', rgb: [108, 194, 74], cmyk: [58, 0, 86, 0] },
  { code: 'PANTONE 368 C', name: 'Apple Green', category: 'coated', hex: '#78BE20', rgb: [120, 190, 32], cmyk: [65, 0, 100, 0] },
  { code: 'PANTONE 375 C', name: 'Bright Chartreuse', category: 'coated', hex: '#97D700', rgb: [151, 215, 0], cmyk: [46, 0, 90, 0] },
  { code: 'PANTONE 347 C', name: 'Forest Mint', category: 'coated', hex: '#009A44', rgb: [0, 154, 68], cmyk: [93, 0, 100, 0] },
  { code: 'PANTONE 3415 C', name: 'Deep Emerald', category: 'coated', hex: '#007A3D', rgb: [0, 122, 61], cmyk: [100, 0, 79, 28] },
  { code: 'PANTONE 3435 C', name: 'Hunter Green', category: 'coated', hex: '#154734', rgb: [21, 71, 52], cmyk: [87, 15, 77, 69] },
  { code: 'PANTONE 355 C', name: 'Kelly Green', category: 'coated', hex: '#009639', rgb: [0, 150, 57], cmyk: [96, 0, 95, 0] },

  // Yellows & Oranges
  { code: 'PANTONE Yellow C', name: 'Process Yellow', category: 'coated', hex: '#FED100', rgb: [254, 209, 0], cmyk: [0, 1, 100, 0] },
  { code: 'PANTONE Yellow 012 C', name: 'Sun Yellow', category: 'coated', hex: '#FFD700', rgb: [255, 215, 0], cmyk: [0, 4, 100, 0] },
  { code: 'PANTONE 109 C', name: 'Dandelion', category: 'coated', hex: '#FFD100', rgb: [255, 209, 0], cmyk: [0, 10, 100, 0] },
  { code: 'PANTONE 116 C', name: 'Warm Yellow', category: 'coated', hex: '#FFCD00', rgb: [255, 205, 0], cmyk: [0, 16, 100, 0] },
  { code: 'PANTONE 123 C', name: 'Gold Yellow', category: 'coated', hex: '#FFC72C', rgb: [255, 199, 44], cmyk: [0, 24, 94, 0] },
  { code: 'PANTONE 130 C', name: 'Amber Gold', category: 'coated', hex: '#F2A900', rgb: [242, 169, 0], cmyk: [0, 32, 100, 0] },
  { code: 'PANTONE 137 C', name: 'Tangerine', category: 'coated', hex: '#FFA300', rgb: [255, 163, 0], cmyk: [0, 41, 100, 0] },
  { code: 'PANTONE Orange 021 C', name: 'Vibrant Orange', category: 'coated', hex: '#FE5000', rgb: [254, 80, 0], cmyk: [0, 70, 100, 0] },
  { code: 'PANTONE 151 C', name: 'Carrot Orange', category: 'coated', hex: '#FF8200', rgb: [255, 130, 0], cmyk: [0, 60, 100, 0] },
  { code: 'PANTONE 165 C', name: 'Flame Orange', category: 'coated', hex: '#FF671F', rgb: [255, 103, 31], cmyk: [0, 69, 98, 0] },
  { code: 'PANTONE 172 C', name: 'Coral Red-Orange', category: 'coated', hex: '#FA4616', rgb: [250, 70, 22], cmyk: [0, 78, 98, 0] },
  { code: 'PANTONE 715 C', name: 'Papaya Orange', category: 'coated', hex: '#FF9E1B', rgb: [255, 158, 27], cmyk: [0, 43, 91, 0] },

  // Purples & Violets
  { code: 'PANTONE Violet C', name: 'Electric Violet', category: 'coated', hex: '#440099', rgb: [68, 0, 153], cmyk: [90, 99, 0, 0] },
  { code: 'PANTONE Purple C', name: 'Medium Purple', category: 'coated', hex: '#BB29BB', rgb: [187, 41, 187], cmyk: [38, 88, 0, 0] },
  { code: 'PANTONE 2685 C', name: 'Deep Royal Purple', category: 'coated', hex: '#330072', rgb: [51, 0, 114], cmyk: [92, 100, 10, 26] },
  { code: 'PANTONE 2665 C', name: 'Amethyst', category: 'coated', hex: '#772583', rgb: [119, 37, 131], cmyk: [61, 95, 0, 0] },
  { code: 'PANTONE 2592 C', name: 'Orchid Violet', category: 'coated', hex: '#A100A1', rgb: [161, 0, 161], cmyk: [49, 94, 0, 0] },
  { code: 'PANTONE 2587 C', name: 'Lavender Violet', category: 'coated', hex: '#8F3985', rgb: [143, 57, 133], cmyk: [47, 85, 6, 0] },
  { code: 'PANTONE 2607 C', name: 'Plum Purple', category: 'coated', hex: '#500778', rgb: [80, 7, 120], cmyk: [80, 100, 0, 15] },

  // Grays, Neutrals & Blacks
  { code: 'PANTONE Black C', name: 'Standard Black', category: 'coated', hex: '#2D2926', rgb: [45, 41, 38], cmyk: [0, 0, 0, 100] },
  { code: 'PANTONE Black 6 C', name: 'Rich Black', category: 'coated', hex: '#101820', rgb: [16, 24, 32], cmyk: [60, 40, 30, 100] },
  { code: 'PANTONE Cool Gray 11 C', name: 'Slate Gray', category: 'coated', hex: '#53565A', rgb: [83, 86, 90], cmyk: [44, 34, 22, 70] },
  { code: 'PANTONE Cool Gray 9 C', name: 'Medium Cool Gray', category: 'coated', hex: '#75787B', rgb: [117, 120, 123], cmyk: [30, 22, 17, 50] },
  { code: 'PANTONE Cool Gray 7 C', name: 'Classic Gray', category: 'coated', hex: '#97999B', rgb: [151, 153, 155], cmyk: [20, 14, 12, 35] },
  { code: 'PANTONE Cool Gray 5 C', name: 'Silver Gray', category: 'coated', hex: '#B1B3B3', rgb: [177, 179, 179], cmyk: [13, 9, 10, 20] },
  { code: 'PANTONE Cool Gray 1 C', name: 'Whisper Gray', category: 'coated', hex: '#D9D9D6', rgb: [217, 217, 214], cmyk: [4, 2, 4, 8] },
  { code: 'PANTONE Warm Gray 7 C', name: 'Warm Taupe', category: 'coated', hex: '#968C83', rgb: [150, 140, 131], cmyk: [14, 19, 21, 38] },
  { code: 'PANTONE 7527 C', name: 'Oatmeal Beige', category: 'coated', hex: '#D6D2C4', rgb: [214, 210, 196], cmyk: [6, 6, 15, 12] },
  { code: 'PANTONE 465 C', name: 'Camel Tan', category: 'coated', hex: '#C3A673', rgb: [195, 166, 115], cmyk: [9, 24, 52, 18] },

  // Uncoated versions (Offset paper print matches)
  { code: 'PANTONE 2174 U', name: 'Royal Blue (Uncoated)', category: 'uncoated', hex: '#3B71D8', rgb: [59, 113, 216], cmyk: [78, 50, 0, 5] },
  { code: 'PANTONE 286 U', name: 'True Blue (Uncoated)', category: 'uncoated', hex: '#1C4FB2', rgb: [28, 79, 178], cmyk: [92, 65, 0, 0] },
  { code: 'PANTONE 185 U', name: 'Signal Red (Uncoated)', category: 'uncoated', hex: '#DE2A42', rgb: [222, 42, 66], cmyk: [0, 89, 65, 0] },
  { code: 'PANTONE 354 U', name: 'Emerald (Uncoated)', category: 'uncoated', hex: '#169F4A', rgb: [22, 159, 74], cmyk: [75, 0, 80, 0] },
  { code: 'PANTONE 116 U', name: 'Warm Yellow (Uncoated)', hex: '#EFC322', category: 'uncoated', rgb: [239, 195, 34], cmyk: [0, 15, 90, 0] },
  { code: 'PANTONE 021 U', name: 'Orange (Uncoated)', hex: '#F05D23', category: 'uncoated', rgb: [240, 93, 35], cmyk: [0, 68, 92, 0] },
  { code: 'PANTONE Purple U', name: 'Purple (Uncoated)', hex: '#AB3E9E', category: 'uncoated', rgb: [171, 62, 158], cmyk: [32, 75, 0, 0] },
  { code: 'PANTONE Cool Gray 7 U', name: 'Cool Gray (Uncoated)', hex: '#A3A6A8', category: 'uncoated', rgb: [163, 166, 168], cmyk: [18, 12, 11, 28] }
];

export const PANTONE_DATABASE: PantoneColor[] = RAW_PANTONES.map((item) => {
  const rgb = { r: item.rgb[0], g: item.rgb[1], b: item.rgb[2] };
  const cmyk = { c: item.cmyk[0], m: item.cmyk[1], y: item.cmyk[2], k: item.cmyk[3] };
  const lab = rgbToLab(rgb);

  return {
    code: item.code,
    name: item.name,
    category: item.category,
    hex: item.hex,
    rgb,
    cmyk,
    lab,
  };
});

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Bookmark,
  ArrowRight,
  BookOpen,
  Layers,
  Check,
  Copy,
  Star,
  ChevronRight,
  Hash,
  Sparkles,
  FunctionSquare,
  Compass,
  Grid3X3,
  Percent,
  Sigma,
  Box,
  Share2,
} from 'lucide-react';
import { MathView } from './MathView';
import { ActiveCategory } from '../types/math';
import { useLanguage } from '../context/LanguageContext';

export interface FormulaItem {
  id: string;
  groupId: string;
  groupTitle: string;
  category: string;
  title: string;
  latex: string;
  description: string;
  exampleExpr?: string;
  targetCat?: ActiveCategory;
  note?: string;
  tags?: string[];
}

export interface FormulaGroup {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  subcategories: { id: string; label: string }[];
}

interface CheatSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFormula: (expr: string, cat?: ActiveCategory) => void;
}

export const CheatSheetsModal: React.FC<CheatSheetsModalProps> = ({
  isOpen,
  onClose,
  onApplyFormula,
}) => {
  const { t } = useLanguage();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [selectedSubId, setSelectedSubId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolboxi_favorites_formulas');
      return saved ? JSON.parse(saved) : ['q_1', 'fsu_3', 'der_1', 'tr_tab_1'];
    } catch {
      return ['q_1', 'fsu_3', 'der_1', 'tr_tab_1'];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('toolboxi_favorites_formulas', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const groups: FormulaGroup[] = [
    {
      id: 'algebra',
      title: 'Алгебра и уравнения',
      icon: Hash,
      subcategories: [
        { id: 'quad', label: 'Квадратные уравнения & Виета' },
        { id: 'fsu', label: 'Формулы умножения (ФСУ)' },
        { id: 'powers', label: 'Степени, корни и радикалы' },
        { id: 'modulus', label: 'Модули и свойства' },
        { id: 'fractions', label: 'Алгебраические дроби' },
      ],
    },
    {
      id: 'calculus',
      title: 'Математический анализ',
      icon: FunctionSquare,
      subcategories: [
        { id: 'derivatives', label: 'Таблица производных & правила' },
        { id: 'integrals', label: 'Таблица интегралов & Ньютон-Лейбниц' },
        { id: 'limits', label: 'Пределы & замечательные пределы' },
        { id: 'investigation', label: 'Экстремумы и касательная' },
      ],
    },
    {
      id: 'trig',
      title: 'Тригонометрия',
      icon: Compass,
      subcategories: [
        { id: 'trig_identity', label: 'Основные тождества & двойные углы' },
        { id: 'trig_table', label: 'Таблица точных значений углов' },
        { id: 'trig_reduction', label: 'Формулы сложения и приведения' },
        { id: 'trig_inverse', label: 'Обратные функции (arcsin, arccos)' },
      ],
    },
    {
      id: 'logarithms',
      title: 'Логарифмы',
      icon: Layers,
      subcategories: [
        { id: 'log_props', label: 'Свойства & тождества' },
        { id: 'log_natural', label: 'Натуральные и десятичные (ln, lg)' },
      ],
    },
    {
      id: 'geometry',
      title: 'Геометрия и стереометрия',
      icon: Box,
      subcategories: [
        { id: 'geom_plane', label: 'Планиметрия (треугольники, круги)' },
        { id: 'geom_solid', label: 'Стереометрия (объемы тел)' },
        { id: 'pythagoras', label: 'Теорема Пифагора и метрика' },
      ],
    },
    {
      id: 'vectors',
      title: 'Векторы и аналитическая геометрия',
      icon: Compass,
      subcategories: [
        { id: 'vec_coords', label: 'Модуль, координаты и расстояние' },
        { id: 'vec_dot', label: 'Скалярное произведение и угол' },
      ],
    },
    {
      id: 'matrices',
      title: 'Матрицы и определители',
      icon: Grid3X3,
      subcategories: [
        { id: 'mat_det', label: 'Определители 2×2 и 3×3 (Саррюс)' },
        { id: 'mat_inv', label: 'Обратная матрица и свойства' },
      ],
    },
    {
      id: 'discrete',
      title: 'Прогрессии и комбинаторика',
      icon: Sigma,
      subcategories: [
        { id: 'prog', label: 'Прогрессии (арифметическая и геометрическая)' },
        { id: 'combinatorics', label: 'Комбинаторика (P, A, C)' },
        { id: 'probability', label: 'Теория вероятностей' },
      ],
    },
    {
      id: 'complex',
      title: 'Комплексные числа',
      icon: Percent,
      subcategories: [
        { id: 'cmp_basic', label: 'Алгебраическая форма и модуль' },
        { id: 'cmp_trig', label: 'Формула Муавра и Эйлера' },
      ],
    },
  ];

  const cheatSheets: FormulaItem[] = [
    // === 1. АЛГЕБРА: КВАДРАТНЫЕ УРАВНЕНИЯ ===
    {
      id: 'q_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'quad',
      title: 'Формула дискриминанта',
      latex: 'D = b^2 - 4ac',
      description: 'D > 0 — два различных корня; D = 0 — один корень (кратности 2); D < 0 — действительных корней нет (в C — два комплексно сопряженных).',
      exampleExpr: 'x² - x - 6 = 0',
      targetCat: 'algebra',
      note: 'Для стандартного квадратного уравнения ax² + bx + c = 0',
      tags: ['дискриминант', 'квадратное', 'корни', 'D'],
    },
    {
      id: 'q_2',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'quad',
      title: 'Корни полного квадратного уравнения',
      latex: 'x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}',
      description: 'Универсальная формула вычисления корней любого квадратного уравнения.',
      exampleExpr: '2x² + 5x - 3 = 0',
      targetCat: 'equations',
      tags: ['корни', 'формула корней'],
    },
    {
      id: 'q_2_even',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'quad',
      title: 'Дискриминант для четного второго коэффициента (D₁)',
      latex: 'D_1 = k^2 - ac, \\quad x_{1,2} = \\frac{-k \\pm \\sqrt{D_1}}{a} \\quad \\left(k = \\frac{b}{2}\\right)',
      description: 'Ускоряет вычисления в 4 раза, когда коэффициент b делится на 2 без остатка.',
      exampleExpr: 'x² - 6x + 5 = 0',
      targetCat: 'algebra',
      note: 'Незаменимо для экономии времени на экзаменах ОГЭ и ЕГЭ',
      tags: ['четный', 'дискриминант', 'D1'],
    },
    {
      id: 'q_3',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'quad',
      title: 'Теорема Виета',
      latex: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}',
      description: 'Связывает корни с коэффициентами. Для приведенного x² + px + q = 0: сумма корней равна -p, а произведение равно q.',
      exampleExpr: 'x² - 5x + 6 = 0',
      targetCat: 'algebra',
      tags: ['виета', 'сумма', 'произведение'],
    },
    {
      id: 'q_4',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'quad',
      title: 'Разложение трёхчлена на множители',
      latex: 'ax^2 + bx + c = a(x - x_1)(x - x_2)',
      description: 'Факторизация квадратного выражения через его найденные корни x₁ и x₂.',
      exampleExpr: 'x² - x - 6',
      targetCat: 'algebra',
      tags: ['разложение', 'множители'],
    },
    {
      id: 'q_5',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'quad',
      title: 'Координаты вершины параболы',
      latex: 'x_v = -\\frac{b}{2a}, \\quad y_v = -\\frac{D}{4a} = f(x_v)',
      description: 'Ось симметрии параболы x = x_v. Вершина — точка минимума при a > 0 и точка максимума при a < 0.',
      exampleExpr: 'x² - 4x + 3 = 0',
      targetCat: 'algebra',
      tags: ['вершина', 'парабола', 'экстремум'],
    },

    // === ФСУ ===
    {
      id: 'fsu_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'fsu',
      title: 'Квадрат суммы и разности',
      latex: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2',
      description: 'Квадрат первого слагаемого плюс/минус удвоенное произведение плюс квадрат второго.',
      exampleExpr: '(x + 3)²',
      targetCat: 'algebraic_properties',
      tags: ['фсу', 'квадрат суммы', 'квадрат разности'],
    },
    {
      id: 'fsu_3',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'fsu',
      title: 'Разность квадратов',
      latex: 'a^2 - b^2 = (a - b)(a + b)',
      description: 'Разность квадратов раскладывается на произведение разности чисел на их сумму.',
      exampleExpr: 'x² - 16',
      targetCat: 'algebraic_properties',
      tags: ['фсу', 'разность квадратов'],
    },
    {
      id: 'fsu_4',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'fsu',
      title: 'Куб суммы и куб разности',
      latex: '(a \\pm b)^3 = a^3 \\pm 3a^2b + 3ab^2 \\pm b^3',
      description: 'Формула третьей степени для бинома.',
      exampleExpr: '(x + 2)³',
      targetCat: 'algebraic_properties',
      tags: ['фсу', 'куб суммы'],
    },
    {
      id: 'fsu_5',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'fsu',
      title: 'Сумма и разность кубов',
      latex: 'a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)',
      description: 'Произведение суммы (или разности) на неполный квадрат противоположного знака.',
      exampleExpr: 'x³ - 8',
      targetCat: 'algebraic_properties',
      tags: ['фсу', 'разность кубов'],
    },

    // === СТЕПЕНИ И КОРНИ ===
    {
      id: 'pow_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'powers',
      title: 'Свойства умножения и деления степеней',
      latex: 'a^n \\cdot a^m = a^{n+m}, \\quad \\frac{a^n}{a^m} = a^{n-m}',
      description: 'При умножении одинаковых оснований степени складываются, при делении — вычитаются.',
      exampleExpr: 'x³ · x²',
      targetCat: 'basic_operations',
      tags: ['степени', 'умножение'],
    },
    {
      id: 'pow_2',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'powers',
      title: 'Степень степени и произведения',
      latex: '(a^n)^m = a^{n \\cdot m}, \\quad (ab)^n = a^n b^n, \\quad \\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}',
      description: 'При возведении степени в степень показатели перемножаются.',
      exampleExpr: '(x²)³',
      targetCat: 'basic_operations',
      tags: ['степени'],
    },
    {
      id: 'pow_3',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'powers',
      title: 'Отрицательная и нулевая степень',
      latex: 'a^{-n} = \\frac{1}{a^n}, \\quad a^0 = 1 \\; (a \\ne 0)',
      description: 'Отрицательный показатель переводит выражение в знаменатель дроби.',
      exampleExpr: '1/x²',
      targetCat: 'rational_expressions',
      tags: ['отрицательная степень'],
    },
    {
      id: 'pow_4',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'powers',
      title: 'Дробный показатель и свойства радикалов',
      latex: 'a^{\\frac{m}{n}} = \\sqrt[n]{a^m}, \\quad \\sqrt[n]{ab} = \\sqrt[n]{a} \\cdot \\sqrt[n]{b}, \\quad \\sqrt[n]{\\frac{a}{b}} = \\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}}',
      description: 'Связь корней произвольной степени с дробными степенями.',
      exampleExpr: '√(x² - 4)',
      targetCat: 'algebra',
      tags: ['корни', 'радикалы'],
    },

    // === МОДУЛИ ===
    {
      id: 'mod_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'modulus',
      title: 'Определение и свойства модуля числа',
      latex: '|x| = \\begin{cases} x, & x \\ge 0 \\\\ -x, & x < 0 \\end{cases}, \\quad |x| = \\sqrt{x^2}',
      description: 'Модуль неотрицателен |x| ≥ 0. Квадрат модуля равен квадрату числа: |x|² = x².',
      exampleExpr: '|2x - 3| = 7',
      targetCat: 'equations',
      tags: ['модуль', 'абсолютная величина'],
    },
    {
      id: 'mod_2',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'modulus',
      title: 'Неравенство треугольника и неравенство Коши',
      latex: '|a + b| \\le |a| + |b|, \\quad \\frac{a + b}{2} \\ge \\sqrt{ab} \\quad (a, b \\ge 0)',
      description: 'Неравенство Коши: среднее арифметическое неотрицательных чисел не меньше среднего геометрического.',
      exampleExpr: '(x + 4)/2',
      targetCat: 'algebra',
      tags: ['коши', 'неравенство треугольника'],
    },

    // === ДРОБИ ===
    {
      id: 'frac_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'fractions',
      title: 'Основное свойство алгебраической дроби',
      latex: '\\frac{A}{B} = \\frac{A \\cdot C}{B \\cdot C} \\quad (B, C \\ne 0), \\quad \\frac{A}{B} \\pm \\frac{C}{D} = \\frac{AD \\pm BC}{BD}',
      description: 'Числитель и знаменатель дроби можно умножать и делить на одно и то же ненулевое выражение.',
      exampleExpr: '(x² - 9)/(x - 3)',
      targetCat: 'fractions',
      tags: ['дроби', 'сокращение'],
    },

    // === 2. МАТЕМАТИЧЕСКИЙ АНАЛИЗ ===
    {
      id: 'der_1',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      title: 'Степенное правило дифференцирования',
      latex: '(x^n)\' = n x^{n-1}, \\quad (c)\' = 0, \\quad (kx)\' = k',
      description: 'Базовое правило дифференцирования для многочленов и степенных функций.',
      exampleExpr: 'd/dx (x^3 - 3x^2 + 2)',
      targetCat: 'derivatives',
      tags: ['производная', 'степенное'],
    },
    {
      id: 'der_2',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      title: 'Правило произведения (формула Лейбница)',
      latex: '(u \\cdot v)\' = u\'v + uv\'',
      description: 'Производная произведения функций равна производной первой на вторую плюс первая на производную второй.',
      exampleExpr: 'd/dx (x^2 * sin(x))',
      targetCat: 'derivatives',
      tags: ['лейбниц', 'произведение'],
    },
    {
      id: 'der_3',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      title: 'Правило дифференцирования дроби (частного)',
      latex: '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2} \\quad (v \\ne 0)',
      description: 'Дифференцирование частного двух функций.',
      exampleExpr: 'd/dx ((x + 1)/(x - 1))',
      targetCat: 'derivatives',
      tags: ['частное', 'дробь'],
    },
    {
      id: 'der_4',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      title: 'Производная сложной функции (цепное правило)',
      latex: '(f(g(x)))\' = f\'(g(x)) \\cdot g\'(x)',
      description: 'Внешняя производная умножается на производную внутренней функции.',
      exampleExpr: 'd/dx (sin(2x))',
      targetCat: 'derivatives',
      tags: ['сложная функция', 'цепное правило'],
    },
    {
      id: 'der_5',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      title: 'Таблица производных элементарных функций',
      latex: '(e^x)\' = e^x, \\quad (\\ln x)\' = \\frac{1}{x}, \\quad (\\sin x)\' = \\cos x, \\quad (\\cos x)\' = -\\sin x, \\quad (\\tan x)\' = \\frac{1}{\\cos^2 x}',
      description: 'Справочные производные экспоненты, логарифма и тригонометрических функций.',
      exampleExpr: 'd/dx (e^x - 2x)',
      targetCat: 'derivatives',
      tags: ['таблица производных', 'синус', 'косинус'],
    },

    // ИНТЕГРАЛЫ
    {
      id: 'int_1',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      title: 'Интеграл степенной функции',
      latex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\ne -1)',
      description: 'Основное правило интегрирования степенных выражений.',
      exampleExpr: '∫(2x + 1) dx',
      targetCat: 'integrals',
      tags: ['интеграл', 'первообразная'],
    },
    {
      id: 'int_2',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      title: 'Табличные интегралы элементарных функций',
      latex: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C, \\quad \\int e^x\\,dx = e^x + C, \\quad \\int \\sin x\\,dx = -\\cos x + C, \\quad \\int \\cos x\\,dx = \\sin x + C',
      description: 'Таблица первообразных логарифма, экспоненты и тригонометрии.',
      exampleExpr: '∫(3x² - 4x + 5) dx',
      targetCat: 'integrals',
      tags: ['таблица интегралов'],
    },
    {
      id: 'int_3',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      title: 'Формула Ньютона-Лейбница (определённый интеграл)',
      latex: '\\int_a^b f(x)\\,dx = F(b) - F(a)',
      description: 'Вычисление определенного интеграла и площади криволинейной трапеции под графиком.',
      exampleExpr: '∫(2x + 1) dx',
      targetCat: 'integrals',
      tags: ['ньютон лейбниц', 'площадь'],
    },
    {
      id: 'int_4',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      title: 'Интегрирование по частям',
      latex: '\\int u\\,dv = u \\cdot v - \\int v\\,du',
      description: 'Метод вычисления интегралов от произведений разнородных функций.',
      exampleExpr: '∫(x * sin(x)) dx',
      targetCat: 'integrals',
      tags: ['по частям'],
    },

    // ПРЕДЕЛЫ
    {
      id: 'lim_1',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'limits',
      title: 'Первый замечательный предел',
      latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{\\tan x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{\\arcsin x}{x} = 1',
      description: 'Раскрытие неопределенности [0/0] для тригонометрических выражений при x → 0.',
      exampleExpr: 'sin(x)/x',
      targetCat: 'derivatives',
      tags: ['первый замечательный', 'предел'],
    },
    {
      id: 'lim_2',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'limits',
      title: 'Второй замечательный предел (число e)',
      latex: '\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e, \\quad \\lim_{\\alpha \\to 0} (1 + \\alpha)^{\\frac{1}{\\alpha}} = e \\approx 2.71828',
      description: 'Фундаментальная константа математического анализа и непрерывного роста.',
      exampleExpr: 'ln(2x) = 4',
      targetCat: 'logarithms',
      tags: ['второй замечательный', 'число e'],
    },
    {
      id: 'lim_3',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'limits',
      title: 'Правило Лопиталя',
      latex: '\\lim_{x \\to x_0} \\frac{f(x)}{g(x)} = \\lim_{x \\to x_0} \\frac{f\'(x)}{g\'(x)} \\quad \\left(\\left[\\frac{0}{0}\\right] \\text{ или } \\left[\\frac{\\infty}{\\infty}\\right]\\right)',
      description: 'Дифференцирование числителя и знаменателя для раскрытия неопределенностей.',
      exampleExpr: 'd/dx (x^3 - 3x^2 + 2)',
      targetCat: 'derivatives',
      tags: ['лопиталь'],
    },

    // КАСАТЕЛЬНАЯ
    {
      id: 'inv_1',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'investigation',
      title: 'Уравнение касательной к графику функции',
      latex: 'y = f(x_0) + f\'(x_0)(x - x_0), \\quad k = \\tan\\alpha = f\'(x_0)',
      description: 'Геометрический смысл производной: угловой коэффициент касательной k = f\'(x₀).',
      exampleExpr: 'd/dx (x^2 - 4x + 3)',
      targetCat: 'derivatives',
      tags: ['касательная', 'геометрический смысл'],
    },

    // === 3. ТРИГОНОМЕТРИЯ ===
    {
      id: 'tr_1',
      groupId: 'trig',
      groupTitle: 'Тригонометрия',
      category: 'trig_identity',
      title: 'Основное тригонометрическое тождество',
      latex: '\\sin^2 x + \\cos^2 x = 1, \\quad 1 + \\tan^2 x = \\frac{1}{\\cos^2 x}, \\quad 1 + \\cot^2 x = \\frac{1}{\\sin^2 x}',
      description: 'Связывает тригонометрические функции одного и того же аргумента.',
      exampleExpr: 'sin(x)^2 + cos(x)^2',
      targetCat: 'trigonometry',
      tags: ['тождество', 'синус', 'косинус'],
    },
    {
      id: 'tr_2',
      groupId: 'trig',
      groupTitle: 'Тригонометрия',
      category: 'trig_identity',
      title: 'Формулы двойного угла',
      latex: '\\sin(2x) = 2\\sin x \\cos x, \\quad \\cos(2x) = \\cos^2 x - \\sin^2 x = 2\\cos^2 x - 1',
      description: 'Выражение функций двойного аргумента через одинарный угол.',
      exampleExpr: 'sin(2x) - cos(x) = 0',
      targetCat: 'trigonometry',
      tags: ['двойной угол'],
    },
    {
      id: 'tr_3',
      groupId: 'trig',
      groupTitle: 'Тригонометрия',
      category: 'trig_identity',
      title: 'Формулы понижения степени',
      latex: '\\sin^2 x = \\frac{1 - \\cos(2x)}{2}, \\quad \\cos^2 x = \\frac{1 + \\cos(2x)}{2}',
      description: 'Позволяют понижать степень тригонометрических выражений при интегрировании.',
      exampleExpr: '2*cos(x)^2 - 1 = 0',
      targetCat: 'trigonometry',
      tags: ['понижение степени'],
    },
    {
      id: 'tr_tab_1',
      groupId: 'trig',
      groupTitle: 'Тригонометрия',
      category: 'trig_table',
      title: 'Таблица точных значений для основных углов',
      latex: '\\begin{array}{|c|c|c|c|c|c|c|} \\hline \\alpha & 0^\\circ (0) & 30^\\circ (\\frac{\\pi}{6}) & 45^\\circ (\\frac{\\pi}{4}) & 60^\\circ (\\frac{\\pi}{3}) & 90^\\circ (\\frac{\\pi}{2}) & 180^\\circ (\\pi) \\\\ \\hline \\sin & 0 & \\frac{1}{2} & \\frac{\\sqrt{2}}{2} & \\frac{\\sqrt{3}}{2} & 1 & 0 \\\\ \\hline \\cos & 1 & \\frac{\\sqrt{3}}{2} & \\frac{\\sqrt{2}}{2} & \\frac{1}{2} & 0 & -1 \\\\ \\hline \\tan & 0 & \\frac{\\sqrt{3}}{3} & 1 & \\sqrt{3} & - & 0 \\\\ \\hline \\end{array}',
      description: 'Справочные табличные значения в радианах и градусах для задач школьной программы и экзаменов.',
      exampleExpr: 'cos(x) = 0.5',
      targetCat: 'trigonometry',
      tags: ['таблица значений', 'углы', 'радианы'],
    },
    {
      id: 'tr_red_1',
      groupId: 'trig',
      groupTitle: 'Тригонометрия',
      category: 'trig_reduction',
      title: 'Формулы приведения тригонометрии',
      latex: '\\sin\\left(\\frac{\\pi}{2} - x\\right) = \\cos x, \\quad \\cos\\left(\\frac{\\pi}{2} - x\\right) = \\sin x, \\quad \\sin(\\pi - x) = \\sin x, \\quad \\cos(\\pi - x) = -\\cos x',
      description: 'Правило: если аргумент содержит π/2 или 3π/2, функция меняется на кофункцию; знак определяется четвертью исходного аргумента.',
      exampleExpr: 'sin(x + 1) = 0.5',
      targetCat: 'trigonometry',
      tags: ['формулы приведения'],
    },
    {
      id: 'tr_inv_1',
      groupId: 'trig',
      groupTitle: 'Тригонометрия',
      category: 'trig_inverse',
      title: 'Обратные тригонометрические функции',
      latex: '\\arcsin x + \\arccos x = \\frac{\\pi}{2}, \\quad \\arctan x + \\text{arccot } x = \\frac{\\pi}{2}',
      description: 'Тождества для арксинуса, арккосинуса и арктангенса при |x| ≤ 1.',
      exampleExpr: 'tan(x) = 1',
      targetCat: 'trigonometry',
      tags: ['арксинус', 'арккосинус', 'обратные'],
    },

    // === 4. ЛОГАРИФМЫ ===
    {
      id: 'log_1',
      groupId: 'logarithms',
      groupTitle: 'Логарифмы',
      category: 'log_props',
      title: 'Основное логарифмическое тождество',
      latex: 'a^{\\log_a b} = b \\quad (a > 0, a \\ne 1, b > 0), \\quad \\log_a 1 = 0, \\quad \\log_a a = 1',
      description: 'Логарифм числа b по основанию a — показатель степени, в которую надо возвести a, чтобы получить b.',
      exampleExpr: 'log_2(8)',
      targetCat: 'logarithms',
      tags: ['основное тождество', 'логарифм'],
    },
    {
      id: 'log_2',
      groupId: 'logarithms',
      groupTitle: 'Логарифмы',
      category: 'log_props',
      title: 'Сумма и разность логарифмов',
      latex: '\\log_a(xy) = \\log_a x + \\log_a y, \\quad \\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y',
      description: 'Логарифм произведения равен сумме логарифмов сомножителей.',
      exampleExpr: 'log_3(x) + log_3(x - 2) = 1',
      targetCat: 'logarithms',
      tags: ['сумма', 'разность', 'логарифмы'],
    },
    {
      id: 'log_3',
      groupId: 'logarithms',
      groupTitle: 'Логарифмы',
      category: 'log_props',
      title: 'Степень под знаком логарифма',
      latex: '\\log_a(x^k) = k \\log_a x, \\quad \\log_{a^p}(x) = \\frac{1}{p} \\log_a x',
      description: 'Вынесение степенных показателей за знак логарифма.',
      exampleExpr: 'log_2(x - 1) = 3',
      targetCat: 'logarithms',
      tags: ['степень логарифм'],
    },
    {
      id: 'log_4',
      groupId: 'logarithms',
      groupTitle: 'Логарифмы',
      category: 'log_natural',
      title: 'Переход к новому основанию и натуральный логарифм',
      latex: '\\log_a b = \\frac{\\log_c b}{\\log_c a} = \\frac{1}{\\log_b a}, \\quad \\ln x = \\log_e x, \\quad \\lg x = \\log_{10} x',
      description: 'Позволяет свести любой логарифм к основанию e (ln) или 10 (lg).',
      exampleExpr: 'ln(2x) = 4',
      targetCat: 'logarithms',
      tags: ['натуральный логарифм', 'ln', 'lg'],
    },

    // === 5. ГЕОМЕТРИЯ И СТЕРЕОМЕТРИЯ ===
    {
      id: 'geo_1',
      groupId: 'geometry',
      groupTitle: 'Геометрия',
      category: 'pythagoras',
      title: 'Теорема Пифагора',
      latex: 'a^2 + b^2 = c^2, \\quad c = \\sqrt{a^2 + b^2}',
      description: 'В прямоугольном треугольнике квадрат длины гипотенузы равен сумме квадратов длин катетов.',
      exampleExpr: '√(3² + 4²)',
      targetCat: 'algebra',
      tags: ['пифагор', 'гипотенуза'],
    },
    {
      id: 'geo_2',
      groupId: 'geometry',
      groupTitle: 'Геометрия',
      category: 'geom_plane',
      title: 'Площадь треугольника (все формулы)',
      latex: 'S = \\frac{1}{2}ah = \\frac{1}{2}ab\\sin\\gamma = \\sqrt{p(p-a)(p-b)(p-c)} = \\frac{abc}{4R} = pr',
      description: 'Через основание и высоту, через угол, формула Герона (p = (a+b+c)/2), через радиусы описанной R и вписанной r окружностей.',
      exampleExpr: '0.5 * 6 * 4',
      targetCat: 'basic_operations',
      tags: ['площадь треугольника', 'герон'],
    },
    {
      id: 'geo_3',
      groupId: 'geometry',
      groupTitle: 'Геометрия',
      category: 'geom_plane',
      title: 'Круг, сектор и окружность',
      latex: 'S_{кр} = \\pi R^2, \\quad C = 2\\pi R = \\pi D, \\quad S_{сект} = \\frac{\\alpha^\\circ}{360^\\circ} \\pi R^2',
      description: 'Площадь круга радиуса R, длина окружности и площадь кругового сектора с центральным углом α.',
      exampleExpr: 'pi * 5^2',
      targetCat: 'basic_operations',
      tags: ['круг', 'окружность', 'сектор'],
    },
    {
      id: 'geo_solid_1',
      groupId: 'geometry',
      groupTitle: 'Геометрия',
      category: 'geom_solid',
      title: 'Объемы тел вращения: шар, цилиндр, конус',
      latex: 'V_{шар} = \\frac{4}{3}\\pi R^3, \\quad V_{цил} = \\pi R^2 h, \\quad V_{кон} = \\frac{1}{3}\\pi R^2 h',
      description: 'Формулы объема сферы, цилиндра и кругового конуса.',
      exampleExpr: '(4/3) * pi * 3^3',
      targetCat: 'basic_operations',
      tags: ['шар', 'цилиндр', 'конус', 'стереометрия'],
    },
    {
      id: 'geo_solid_2',
      groupId: 'geometry',
      groupTitle: 'Геометрия',
      category: 'geom_solid',
      title: 'Объемы призмы и пирамиды',
      latex: 'V_{призма} = S_{осн} \\cdot h, \\quad V_{пирамида} = \\frac{1}{3} S_{осн} \\cdot h',
      description: 'Объем любой прямой призмы и произвольной пирамиды.',
      exampleExpr: '(1/3) * 12 * 5',
      targetCat: 'basic_operations',
      tags: ['призма', 'пирамида'],
    },

    // === 6. ВЕКТОРЫ ===
    {
      id: 'vec_1',
      groupId: 'vectors',
      groupTitle: 'Векторы',
      category: 'vec_coords',
      title: 'Длина вектора и евклидово расстояние',
      latex: '|\\vec{a}| = \\sqrt{x^2 + y^2 + z^2}, \\quad d(A,B) = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}',
      description: 'Модуль вектора по его координатам и расстояние между точками A и B.',
      exampleExpr: '√(2² + 3²)',
      targetCat: 'basic_operations',
      tags: ['длина вектора', 'расстояние'],
    },
    {
      id: 'vec_2',
      groupId: 'vectors',
      groupTitle: 'Векторы',
      category: 'vec_dot',
      title: 'Скалярное произведение векторов и угол',
      latex: '\\vec{a} \\cdot \\vec{b} = x_1 x_2 + y_1 y_2 = |\\vec{a}| |\\vec{b}| \\cos\\alpha, \\quad \\cos\\alpha = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}| |\\vec{b}|}',
      description: 'Векторы перпендикулярны тогда и только тогда, когда их скалярное произведение равно нулю: a·b = 0.',
      exampleExpr: 'x + y = 5; 2x - y = 1',
      targetCat: 'systems',
      tags: ['скалярное произведение', 'угол векторов'],
    },

    // === 7. МАТРИЦЫ ===
    {
      id: 'mat_1',
      groupId: 'matrices',
      groupTitle: 'Матрицы',
      category: 'mat_det',
      title: 'Определитель матрицы 2×2',
      latex: '\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
      description: 'Разность произведений элементов главной диагонали и побочной диагонали.',
      exampleExpr: 'det([[3, 4], [2, 5]])',
      targetCat: 'matrix',
      tags: ['определитель 2x2', 'det'],
    },
    {
      id: 'mat_2',
      groupId: 'matrices',
      groupTitle: 'Матрицы',
      category: 'mat_det',
      title: 'Определитель матрицы 3×3 (правило Саррюса)',
      latex: '\\det A = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31} - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33}',
      description: 'Правило треугольников для вычисления определителя третьего порядка.',
      exampleExpr: 'det([[1, 2, 3], [0, 1, 4], [5, 6, 0]])',
      targetCat: 'matrix',
      tags: ['саррюс', 'определитель 3x3'],
    },
    {
      id: 'mat_3',
      groupId: 'matrices',
      groupTitle: 'Матрицы',
      category: 'mat_inv',
      title: 'Обратная матрица и свойства',
      latex: 'A^{-1} = \\frac{1}{\\det A} \\cdot C^T, \\quad A \\cdot A^{-1} = I, \\quad (AB)^{-1} = B^{-1} A^{-1}',
      description: 'Обратная матрица существует тогда и только тогда, когда матрица невырожденная: det A ≠ 0.',
      exampleExpr: 'inv([[2, 1], [5, 3]])',
      targetCat: 'matrix',
      tags: ['обратная матрица', 'инверсия'],
    },

    // === 8. ПРОГРЕССИИ И ДИСКРЕТНАЯ МАТЕМАТИКА ===
    {
      id: 'pr_1',
      groupId: 'discrete',
      groupTitle: 'Прогрессии',
      category: 'prog',
      title: 'Арифметическая прогрессия (n-й член и сумма)',
      latex: 'a_n = a_1 + (n-1)d, \\quad S_n = \\frac{a_1 + a_n}{2} \\cdot n = \\frac{2a_1 + (n-1)d}{2} \\cdot n',
      description: 'Формула любого n-го члена и сумма первых n членов с разностью d.',
      exampleExpr: '3 + 9*4',
      targetCat: 'sequences',
      tags: ['арифметическая прогрессия', 'Sn'],
    },
    {
      id: 'pr_2',
      groupId: 'discrete',
      groupTitle: 'Прогрессии',
      category: 'prog',
      title: 'Геометрическая прогрессия',
      latex: 'b_n = b_1 \\cdot q^{n-1}, \\quad S_n = \\frac{b_1(q^n - 1)}{q - 1} \\; (q \\ne 1), \\quad S = \\frac{b_1}{1 - q} \\; (|q| < 1)',
      description: 'Сумма n членов и сумма бесконечно убывающей геометрической прогрессии.',
      exampleExpr: '2*(3^5 - 1)/(3 - 1)',
      targetCat: 'sequences',
      tags: ['геометрическая прогрессия', 'бесконечно убывающая'],
    },
    {
      id: 'comb_1',
      groupId: 'discrete',
      groupTitle: 'Комбинаторика',
      category: 'combinatorics',
      title: 'Перестановки, Размещения и Сочетания',
      latex: 'P_n = n!, \\quad A_n^k = \\frac{n!}{(n-k)!}, \\quad C_n^k = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}',
      description: 'P_n — перестановки; A_n^k — размещения (порядок важен); C_n^k — сочетания (выборка без учета порядка).',
      exampleExpr: '6! / (2! * 4!)',
      targetCat: 'basic_operations',
      tags: ['факториал', 'сочетания', 'размещения', 'бином'],
    },
    {
      id: 'prob_1',
      groupId: 'discrete',
      groupTitle: 'Вероятность',
      category: 'probability',
      title: 'Классическая вероятность и теоремы сложения',
      latex: 'P(A) = \\frac{m}{n}, \\quad P(A + B) = P(A) + P(B) - P(AB), \\quad P(AB) = P(A) \\cdot P(B|A)',
      description: 'Отношение благоприятных исходов m к общему числу равновозможных n.',
      exampleExpr: '3/6',
      targetCat: 'basic_operations',
      tags: ['вероятность', 'случайные события'],
    },

    // === 9. КОМПЛЕКСНЫЕ ЧИСЛА ===
    {
      id: 'cmp_1',
      groupId: 'complex',
      groupTitle: 'Комплексные числа',
      category: 'cmp_basic',
      title: 'Алгебраическая форма и модуль',
      latex: 'i^2 = -1, \\quad z = a + bi, \\quad |z| = \\sqrt{a^2 + b^2}, \\quad \\bar{z} = a - bi',
      description: 'Мнимая единица i, сопряженное число z̄ и евклидов модуль на комплексной плоскости.',
      exampleExpr: 'x² + 4 = 0',
      targetCat: 'algebra',
      tags: ['комплексные', 'мнимая единица', 'i'],
    },
    {
      id: 'cmp_2',
      groupId: 'complex',
      groupTitle: 'Комплексные числа',
      category: 'cmp_trig',
      title: 'Формула Эйлера и формула Муавра',
      latex: 'e^{i\\varphi} = \\cos\\varphi + i\\sin\\varphi, \\quad z^n = r^n(\\cos(n\\varphi) + i\\sin(n\\varphi))',
      description: 'Связывает тригонометрическую и показательную формы, возведение комплексных чисел в степень n.',
      exampleExpr: 'cos(x) = 0.5',
      targetCat: 'trigonometry',
      tags: ['эйлер', 'муавр', 'комплексные числа'],
    },
  ];

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    return cheatSheets.filter((item) => {
      // 1. Favorites tab filter
      if (selectedGroupId === 'favorites') {
        if (!favorites.includes(item.id)) return false;
      } else if (selectedGroupId !== 'all') {
        // Group filter
        if (item.groupId !== selectedGroupId) return false;
        // Subcategory filter
        if (selectedSubId !== 'all' && item.category !== selectedSubId) return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inLatex = item.latex.toLowerCase().includes(q);
        const inTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inLatex && !inTags) return false;
      }

      return true;
    });
  }, [cheatSheets, selectedGroupId, selectedSubId, searchQuery, favorites]);

  // Current active group metadata
  const currentGroup = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId);
  }, [groups, selectedGroupId]);

  const handleCopyLatex = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Window */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-6xl h-[92vh] max-h-[920px] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 transition-colors">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-blue-50/40 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {t.modals.cheatsheets.title}
                </h2>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                  {cheatSheets.length} {t.modals.cheatsheets.subtitle}
                </span>
                {favorites.length > 0 && (
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200/50 dark:border-amber-800/50">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{favorites.length} ★</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.modals.cheatsheets.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.modals.cheatsheets.close}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Strip */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 transition-colors">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.modals.cheatsheets.searchPlaceholder}
              className="w-full bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">
            Найдено: <strong className="text-slate-900 dark:text-white">{filteredFormulas.length}</strong>
          </div>
        </div>

        {/* Two-Column Explorer Body (Stacked on mobile, side-by-side on desktop) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT SIDEBAR: Organized Categories Tree */}
          <aside className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 flex flex-col shrink-0 max-h-36 md:max-h-none overflow-y-auto">
            {/* Quick Filter: All & Favorites */}
            <div className="p-3 space-y-1 border-b border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedGroupId('all');
                  setSelectedSubId('all');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedGroupId === 'all'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Все шпаргалки</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedGroupId === 'all'
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cheatSheets.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedGroupId('favorites');
                  setSelectedSubId('all');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedGroupId === 'favorites'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Моё избранное</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedGroupId === 'favorites'
                      ? 'bg-amber-600 text-amber-100'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {favorites.length}
                </span>
              </button>
            </div>

            {/* Subject Categories Tree */}
            <div className="p-3 space-y-2 flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider px-2 block">
                Разделы математики
              </span>

              {groups.map((group) => {
                const Icon = group.icon;
                const isGroupActive = selectedGroupId === group.id;
                const groupCount = cheatSheets.filter((c) => c.groupId === group.id).length;

                return (
                  <div key={group.id} className="space-y-1">
                    {/* Main Group Header Button */}
                    <button
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setSelectedSubId('all');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer group ${
                        isGroupActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/80'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isGroupActive
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{group.title}</span>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                          isGroupActive
                            ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
                            : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {groupCount}
                      </span>
                    </button>

                    {/* Subcategories (Visible when group is active) */}
                    {isGroupActive && (
                      <div className="pl-4 pr-1 space-y-0.5 animate-in slide-in-from-top-1">
                        <button
                          onClick={() => setSelectedSubId('all')}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center justify-between ${
                            selectedSubId === 'all'
                              ? 'bg-emerald-600 text-white font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>Все темы раздела</span>
                          <span className="text-[10px] opacity-80">{groupCount}</span>
                        </button>

                        {group.subcategories.map((sub) => {
                          const subCount = cheatSheets.filter((c) => c.category === sub.id).length;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setSelectedSubId(sub.id)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center justify-between ${
                                selectedSubId === sub.id
                                  ? 'bg-emerald-600 text-white font-semibold'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                              }`}
                            >
                              <span className="truncate pr-1">{sub.label}</span>
                              <span className="text-[10px] opacity-75">{subCount}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* RIGHT WORKSPACE: Formula Cards Grid with Active Filter Badges */}
          <main className="flex-1 flex flex-col bg-slate-100/40 dark:bg-slate-950/40 overflow-hidden">
            {/* Active Context Banner */}
            <div className="px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Раздел:</span>
                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {selectedGroupId === 'all'
                    ? 'Все шпаргалки'
                    : selectedGroupId === 'favorites'
                    ? 'Моё избранное'
                    : currentGroup?.title}
                </span>

                {selectedSubId !== 'all' && currentGroup && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                      {currentGroup.subcategories.find((s) => s.id === selectedSubId)?.label}
                    </span>
                  </>
                )}
              </div>

              {selectedGroupId !== 'all' && selectedGroupId !== 'favorites' && currentGroup && (
                <div className="flex flex-wrap items-center gap-1.5 max-w-full">
                  <button
                    onClick={() => setSelectedSubId('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                      selectedSubId === 'all'
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-2xs font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Все темы
                  </button>
                  {currentGroup.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                        selectedSubId === sub.id
                          ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/60'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scrollable Formulas Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {filteredFormulas.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Формулы не найдены</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                    {selectedGroupId === 'favorites'
                      ? 'В вашем списке избранного пока нет формул. Нажмите на звёздочку рядом с любой формулой, чтобы добавить её сюда.'
                      : `По запросу «${searchQuery}» ничего не найдено. Попробуйте изменить формулировку или сбросить фильтры.`}
                  </p>
                  {(searchQuery || selectedGroupId !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGroupId('all');
                        setSelectedSubId('all');
                      }}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      Показать все формулы
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFormulas.map((item) => {
                    const isFav = favorites.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-xs transition flex flex-col justify-between group"
                      >
                        <div>
                          {/* Card Top: Group & Title & Star & Copy */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                                {item.groupTitle}
                              </span>
                              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-950 dark:group-hover:text-emerald-300 transition">
                                {item.title}
                              </h3>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => toggleFavorite(item.id, e)}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  isFav
                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400'
                                    : 'text-slate-300 dark:text-slate-600 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                                title={isFav ? 'Удалить из избранного' : 'Добавить в избранное'}
                              >
                                <Star
                                  className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`}
                                />
                              </button>

                              <button
                                onClick={() => handleCopyLatex(item.id, item.latex)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                title="Скопировать формулу (LaTeX)"
                              >
                                {copiedId === item.id ? (
                                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Math Display View */}
                          <div className="my-3 p-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-center overflow-x-auto scrollbar-none font-serif text-slate-900 dark:text-white text-sm sm:text-base">
                            <MathView latex={item.latex} />
                          </div>

                          {/* Mathematical Description */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                            {item.description}
                          </p>

                          {/* Special Tip / Exam Note */}
                          {item.note && (
                            <div className="mt-2.5 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 px-3 py-1.5 rounded-xl leading-relaxed">
                              💡 <strong>Совет:</strong> {item.note}
                            </div>
                          )}
                        </div>

                        {/* Card Bottom: Example Solver Button */}
                        {item.exampleExpr && (
                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[170px]">
                              Пример: {item.exampleExpr}
                            </span>
                            <button
                              onClick={() => {
                                onApplyFormula(item.exampleExpr!, item.targetCat);
                                onClose();
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 shadow-2xs border border-emerald-200/60 dark:border-emerald-800/60"
                            >
                              <span>{t.modals.cheatsheets.applyBtn}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <div className="flex items-center gap-2">
            <span>
              {(t.modals.samples as any).countShown || 'Показано формул:'} <strong className="text-slate-900 dark:text-white">{filteredFormulas.length}</strong> {(t.modals.samples as any).of || 'из'} {cheatSheets.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition cursor-pointer"
          >
            {t.modals.cheatsheets.close}
          </button>
        </div>
      </div>
    </div>
  );
};

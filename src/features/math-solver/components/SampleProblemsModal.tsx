import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  Award,
  Star,
  ChevronRight,
  Copy,
  Hash,
  FunctionSquare,
  Scale,
  Compass,
  Grid3X3,
  TrendingUp,
  Activity,
  Filter,
} from 'lucide-react';
import { MathView } from './MathView';
import { ActiveCategory } from '../types/math';
import { useLanguage } from '../context/LanguageContext';

export interface SampleProblemItem {
  id: string;
  groupId: string;
  groupTitle: string;
  category: ActiveCategory;
  categoryName: string;
  level: 'Базовый' | 'Средний' | 'Сложный' | 'Олимпиадный' | 'Инженерный';
  title: string;
  latex: string;
  expr: string;
  description: string;
  tags?: string[];
}

export interface ProblemGroup {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  subcategories: { id: string; label: string }[];
}

interface SampleProblemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProblem: (expr: string, cat?: ActiveCategory) => void;
  initialCategory?: ActiveCategory;
}

export const SampleProblemsModal: React.FC<SampleProblemsModalProps> = ({
  isOpen,
  onClose,
  onSelectProblem,
  initialCategory,
}) => {
  const { t } = useLanguage();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [selectedSubId, setSelectedSubId] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolboxi_favorites_problems');
      return saved ? JSON.parse(saved) : ['alg_1', 'der_1', 'sys_1', 'inq_3'];
    } catch {
      return ['alg_1', 'der_1', 'sys_1', 'inq_3'];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('toolboxi_favorites_problems', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const groups: ProblemGroup[] = [
    {
      id: 'algebra',
      title: 'Алгебра и уравнения',
      icon: Hash,
      subcategories: [
        { id: 'algebra', label: 'Квадратные уравнения' },
        { id: 'equations', label: 'Линейные, биквадратные и с модулем' },
        { id: 'fractions', label: 'Алгебраические дроби' },
        { id: 'polynomials', label: 'Многочлены и факторизация' },
      ],
    },
    {
      id: 'calculus',
      title: 'Математический анализ',
      icon: FunctionSquare,
      subcategories: [
        { id: 'derivatives', label: 'Производные и дифференцирование' },
        { id: 'integrals', label: 'Интегралы и площади' },
      ],
    },
    {
      id: 'inequalities_systems',
      title: 'Неравенства и системы',
      icon: Scale,
      subcategories: [
        { id: 'inequalities', label: 'Неравенства (линейные и метод интервалов)' },
        { id: 'systems', label: 'Системы уравнений и неравенств' },
      ],
    },
    {
      id: 'transcendental',
      title: 'Логарифмы и тригонометрия',
      icon: Compass,
      subcategories: [
        { id: 'logarithms', label: 'Логарифмические уравнения' },
        { id: 'trigonometry', label: 'Тригонометрические уравнения' },
      ],
    },
    {
      id: 'matrices',
      title: 'Матрицы и линейная алгебра',
      icon: Grid3X3,
      subcategories: [
        { id: 'matrix', label: 'Определители и матрицы' },
      ],
    },
    {
      id: 'applied',
      title: 'Прогрессии и прикладные задачи',
      icon: TrendingUp,
      subcategories: [
        { id: 'sequences', label: 'Арифметическая и геометрическая прогрессии' },
        { id: 'engineering', label: 'Физика, траектории и инженерия' },
      ],
    },
  ];

  const catalog: SampleProblemItem[] = [
    // 1. АЛГЕБРА & КВАДРАТНЫЕ УРАВНЕНИЯ
    {
      id: 'alg_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'algebra',
      categoryName: 'Квадратные уравнения',
      level: 'Базовый',
      title: 'Квадратное уравнение (теорема Виета)',
      latex: 'x^2 - x - 6 = 0',
      expr: 'x² - x - 6 = 0',
      description: 'Корни x₁ = 3, x₂ = -2. Разложение на множители: (x - 3)(x + 2) = 0.',
      tags: ['виета', 'дискриминант', 'квадратное'],
    },
    {
      id: 'alg_2',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'algebra',
      categoryName: 'Квадратные уравнения',
      level: 'Базовый',
      title: 'Неполное квадратное уравнение без свободного члена',
      latex: '2x^2 + 8x = 0',
      expr: '2x² + 8x = 0',
      description: 'Вынесение общего множителя 2x(x + 4) = 0. Корни x = 0 и x = -4.',
      tags: ['неполное', 'множитель'],
    },
    {
      id: 'alg_3',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'algebra',
      categoryName: 'Квадратные уравнения',
      level: 'Базовый',
      title: 'Разность квадратов',
      latex: 'x^2 - 16 = 0',
      expr: 'x² - 16 = 0',
      description: 'Разложение (x - 4)(x + 4) = 0. Симметричные корни x = ±4.',
      tags: ['разность квадратов', 'симметричные корни'],
    },
    {
      id: 'alg_4',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'algebra',
      categoryName: 'Квадратные уравнения',
      level: 'Средний',
      title: 'Уравнение с коэффициентом a > 1',
      latex: '2x^2 + 5x - 3 = 0',
      expr: '2x² + 5x - 3 = 0',
      description: 'Дискриминант D = 25 + 24 = 49. Корни x₁ = 0.5, x₂ = -3.',
      tags: ['дискриминант', 'корни'],
    },
    {
      id: 'alg_5',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'algebra',
      categoryName: 'Квадратные уравнения',
      level: 'Средний',
      title: 'Полный квадрат суммы (D = 0)',
      latex: 'x^2 + 6x + 9 = 0',
      expr: 'x² + 6x + 9 = 0',
      description: 'Дискриминант D = 0. Единственный корень x = -3 кратности 2.',
      tags: ['полный квадрат', 'D=0'],
    },
    {
      id: 'alg_6',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'algebra',
      categoryName: 'Квадратные уравнения',
      level: 'Сложный',
      title: 'Иррациональные корни (формула с корнем)',
      latex: 'x^2 - 4x + 1 = 0',
      expr: 'x² - 4x + 1 = 0',
      description: 'Дискриминант D = 12. Корни x = 2 ± √3.',
      tags: ['иррациональные корни', 'радикалы'],
    },

    // 2. УРАВНЕНИЯ (ЛИНЕЙНЫЕ, БИКВАДРАТНЫЕ, С МОДУЛЕМ)
    {
      id: 'eq_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'equations',
      categoryName: 'Линейные уравнения',
      level: 'Базовый',
      title: 'Линейное уравнение с раскрытием скобок',
      latex: '3(x - 2) = 2x + 5',
      expr: '3(x - 2) = 2x + 5',
      description: 'Перенос слагаемых: 3x - 6 = 2x + 5 ⇒ x = 11.',
      tags: ['линейное', 'скобки'],
    },
    {
      id: 'eq_2',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'equations',
      categoryName: 'Линейные уравнения',
      level: 'Базовый',
      title: 'Линейное уравнение первой степени',
      latex: '5x - 20 = 0',
      expr: '5x - 20 = 0',
      description: 'Перенос константы и деление: 5x = 20 ⇒ x = 4.',
      tags: ['линейное'],
    },
    {
      id: 'eq_3',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'equations',
      categoryName: 'Уравнения 4-й степени',
      level: 'Сложный',
      title: 'Биквадратное уравнение 4-й степени',
      latex: 'x^4 - 5x^2 + 4 = 0',
      expr: 'x⁴ - 5x² + 4 = 0',
      description: 'Замена переменной t = x²: t² - 5t + 4 = 0 ⇒ t = 1, 4 ⇒ x = ±1, ±2.',
      tags: ['биквадратное', 'замена переменной'],
    },
    {
      id: 'eq_4',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'equations',
      categoryName: 'Уравнения с модулем',
      level: 'Сложный',
      title: 'Уравнение с модулем',
      latex: '|2x - 3| = 7',
      expr: '|2x - 3| = 7',
      description: 'Раскрытие по определению модуля: 2x - 3 = 7 или 2x - 3 = -7 ⇒ x = 5, -2.',
      tags: ['модуль', 'уравнение с модулем'],
    },
    {
      id: 'eq_5',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'equations',
      categoryName: 'Дробно-рациональные',
      level: 'Средний',
      title: 'Дробно-рациональное уравнение',
      latex: '\\frac{x + 2}{x - 1} = 4',
      expr: '(x + 2)/(x - 1) = 4',
      description: 'ОДЗ: x ≠ 1. Перекрестное умножение x + 2 = 4(x - 1) ⇒ 3x = 6 ⇒ x = 2.',
      tags: ['дроби', 'одз'],
    },
    {
      id: 'eq_6',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'equations',
      categoryName: 'Кубические уравнения',
      level: 'Олимпиадный',
      title: 'Кубическое уравнение с группировкой',
      latex: 'x^3 - 3x^2 - 4x + 12 = 0',
      expr: 'x³ - 3x² - 4x + 12 = 0',
      description: 'Группировка x²(x - 3) - 4(x - 3) = (x² - 4)(x - 3) = 0 ⇒ x = 3, ±2.',
      tags: ['кубическое', 'группировка'],
    },

    // 3. НЕРАВЕНСТВА
    {
      id: 'inq_1',
      groupId: 'inequalities_systems',
      groupTitle: 'Неравенства',
      category: 'inequalities',
      categoryName: 'Линейные неравенства',
      level: 'Базовый',
      title: 'Линейное неравенство с отрицательным коэффициентом',
      latex: '-3x + 9 > 0',
      expr: '-3x + 9 > 0',
      description: 'Перемена знака неравенства при делении на -3: x < 3.',
      tags: ['линейное', 'неравенство'],
    },
    {
      id: 'inq_2',
      groupId: 'inequalities_systems',
      groupTitle: 'Неравенства',
      category: 'inequalities',
      categoryName: 'Линейные неравенства',
      level: 'Базовый',
      title: 'Линейное неравенство с обеими частями',
      latex: '2x - 5 \\ge x + 1',
      expr: '2x - 5 ≥ x + 1',
      description: 'Приведение подобных слагаемых: x ≥ 6. Луч [6; +∞).',
      tags: ['линейное'],
    },
    {
      id: 'inq_3',
      groupId: 'inequalities_systems',
      groupTitle: 'Неравенства',
      category: 'inequalities',
      categoryName: 'Квадратные неравенства',
      level: 'Средний',
      title: 'Квадратное неравенство (парабола)',
      latex: 'x^2 - x - 6 \\le 0',
      expr: 'x² - x - 6 ≤ 0',
      description: 'Парабола ветвями вверх пересекает ось OX в точках -2 и 3. Ответ: отрезок [-2; 3].',
      tags: ['парабола', 'метод интервалов'],
    },
    {
      id: 'inq_4',
      groupId: 'inequalities_systems',
      groupTitle: 'Неравенства',
      category: 'inequalities',
      categoryName: 'Квадратные неравенства',
      level: 'Средний',
      title: 'Строгое квадратное неравенство',
      latex: 'x^2 - 16 > 0',
      expr: 'x² - 16 > 0',
      description: 'Внешние промежутки объединения лучей (-∞; -4) ∪ (4; +∞).',
      tags: ['строгое', 'разность квадратов'],
    },
    {
      id: 'inq_5',
      groupId: 'inequalities_systems',
      groupTitle: 'Неравенства',
      category: 'inequalities',
      categoryName: 'Дробные неравенства',
      level: 'Сложный',
      title: 'Дробное неравенство методом интервалов',
      latex: '\\frac{x - 3}{x + 2} \\ge 0',
      expr: '(x - 3)/(x + 2) ≥ 0',
      description: 'ОДЗ: x ≠ -2. Нуль числителя x = 3. Ответ: (-∞; -2) ∪ [3; +∞).',
      tags: ['дробное', 'интервалы'],
    },
    {
      id: 'inq_6',
      groupId: 'inequalities_systems',
      groupTitle: 'Неравенства',
      category: 'inequalities',
      categoryName: 'Двойные неравенства',
      level: 'Олимпиадный',
      title: 'Двойное неравенство с модулем',
      latex: '|x - 2| < 3',
      expr: '|x - 2| < 3',
      description: 'Эквивалентно системе -3 < x - 2 < 3 ⇒ интервал (-1; 5).',
      tags: ['модуль', 'двойное неравенство'],
    },

    // 4. СИСТЕМЫ УРАВНЕНИЙ
    {
      id: 'sys_1',
      groupId: 'inequalities_systems',
      groupTitle: 'Системы',
      category: 'systems',
      categoryName: 'Системы 2×2',
      level: 'Базовый',
      title: 'Классическая система 2×2 методом сложения',
      latex: '\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}',
      expr: 'x + y = 5; 2x - y = 1',
      description: 'Сложение уравнений исключает y: 3x = 6 ⇒ x = 2, y = 3.',
      tags: ['система', 'метод сложения'],
    },
    {
      id: 'sys_2',
      groupId: 'inequalities_systems',
      groupTitle: 'Системы',
      category: 'systems',
      categoryName: 'Системы 2×2',
      level: 'Средний',
      title: 'Система методом подстановки',
      latex: '\\begin{cases} 2x + 3y = 12 \\\\ x - y = 1 \\end{cases}',
      expr: '2x + 3y = 12; x - y = 1',
      description: 'Выражаем x = y + 1 ⇒ 2(y + 1) + 3y = 12 ⇒ 5y = 10 ⇒ y = 2, x = 3.',
      tags: ['подстановка', 'система'],
    },
    {
      id: 'sys_3',
      groupId: 'inequalities_systems',
      groupTitle: 'Системы',
      category: 'systems',
      categoryName: 'Системы неравенств',
      level: 'Средний',
      title: 'Система двух неравенств (полуинтервал)',
      latex: '\\begin{cases} 2x - 4 \\ge 0 \\\\ x + 3 < 8 \\end{cases}',
      expr: '2x - 4 ≥ 0; x + 3 < 8',
      description: 'Пересечение промежутков [2; +∞) и (-∞; 5) даёт полуинтервал [2; 5).',
      tags: ['система неравенств'],
    },
    {
      id: 'sys_4',
      groupId: 'inequalities_systems',
      groupTitle: 'Системы',
      category: 'systems',
      categoryName: 'Нелинейные системы',
      level: 'Сложный',
      title: 'Нелинейная система (окружность и прямая)',
      latex: '\\begin{cases} x^2 + y^2 = 25 \\\\ x + y = 7 \\end{cases}',
      expr: 'x² + y² = 25; x + y = 7',
      description: 'Две точки пересечения графиков на координатной плоскости: (3; 4) и (4; 3).',
      tags: ['окружность', 'нелинейная'],
    },

    // 5. ПРОИЗВОДНЫЕ
    {
      id: 'der_1',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      categoryName: 'Производные',
      level: 'Базовый',
      title: 'Производная квадратичной параболы',
      latex: 'f(x) = x^2 - 4x + 3',
      expr: 'd/dx (x^2 - 4x + 3)',
      description: "Степенное правило (x²)' = 2x, (x)' = 1. f'(x) = 2x - 4.",
      tags: ['производная', 'парабола'],
    },
    {
      id: 'der_2',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      categoryName: 'Производные',
      level: 'Базовый',
      title: 'Производная кубического многочлена',
      latex: 'f(x) = x^3 - 3x^2 + 2',
      expr: 'd/dx (x^3 - 3x^2 + 2)',
      description: "Степенное правило. f'(x) = 3x² - 6x = 3x(x - 2).",
      tags: ['кубическая', 'производная'],
    },
    {
      id: 'der_3',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      categoryName: 'Производные',
      level: 'Средний',
      title: 'Производная сложной тригонометрической функции',
      latex: 'f(x) = \\sin(2x)',
      expr: 'd/dx (sin(2x))',
      description: "Цепное правило: (sin(u))' = cos(u)·u'. f'(x) = 2·cos(2x).",
      tags: ['тригонометрия', 'сложная функция'],
    },
    {
      id: 'der_4',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      categoryName: 'Производные',
      level: 'Средний',
      title: 'Производная дроби (правило частного)',
      latex: 'f(x) = \\frac{x + 1}{x - 1}',
      expr: 'd/dx ((x + 1)/(x - 1))',
      description: "Формула (u/v)' = (u'v - uv')/v². f'(x) = -2/(x - 1)².",
      tags: ['дробь', 'частное'],
    },
    {
      id: 'der_5',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      categoryName: 'Производные',
      level: 'Сложный',
      title: 'Производная произведения с экспонентой',
      latex: 'f(x) = x^2 \\cdot e^x',
      expr: 'd/dx (x^2 * e^x)',
      description: "Формула Лейбница (uv)' = u'v + uv'. f'(x) = e^x(x² + 2x).",
      tags: ['лейбниц', 'экспонента'],
    },
    {
      id: 'der_6',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'derivatives',
      categoryName: 'Производные',
      level: 'Инженерный',
      title: 'Скорость изменения движения (v = s\')',
      latex: 's(t) = -5t^2 + 30t',
      expr: 'd/dx (-5*x^2 + 30*x)',
      description: 'Физический смысл производной: мгновенная скорость v(t) = -10t + 30.',
      tags: ['скорость', 'физика', 'механика'],
    },

    // 6. ИНТЕГРАЛЫ
    {
      id: 'int_1',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      categoryName: 'Интегралы',
      level: 'Базовый',
      title: 'Неопределённый интеграл линейной функции',
      latex: '\\int (2x + 1)\\,dx',
      expr: '∫(2x + 1) dx',
      description: 'Табличные первообразные: F(x) = x² + x + C.',
      tags: ['первообразная', 'интеграл'],
    },
    {
      id: 'int_2',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      categoryName: 'Интегралы',
      level: 'Средний',
      title: 'Интеграл полинома второй степени',
      latex: '\\int (3x^2 - 4x + 5)\\,dx',
      expr: '∫(3x² - 4x + 5) dx',
      description: 'Почленное интегрирование: F(x) = x³ - 2x² + 5x + C.',
      tags: ['многочлен', 'интеграл'],
    },
    {
      id: 'int_3',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      categoryName: 'Интегралы',
      level: 'Средний',
      title: 'Интеграл тригонометрической функции',
      latex: '\\int \\sin(x)\\,dx',
      expr: '∫sin(x) dx',
      description: 'Табличный интеграл: F(x) = -cos(x) + C.',
      tags: ['синус', 'первообразная'],
    },
    {
      id: 'int_4',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      categoryName: 'Интегралы',
      level: 'Средний',
      title: 'Интеграл экспоненциальной функции',
      latex: '\\int e^{2x}\\,dx',
      expr: '∫e^(2x) dx',
      description: 'Интегрирование с линейным аргументом: F(x) = 0.5·e^(2x) + C.',
      tags: ['экспонента'],
    },
    {
      id: 'int_5',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      categoryName: 'Интегралы',
      level: 'Сложный',
      title: 'Интеграл обратной функции 1/x',
      latex: '\\int \\frac{1}{x}\\,dx',
      expr: '∫(1/x) dx',
      description: 'Первообразная даёт натуральный логарифм: F(x) = ln|x| + C.',
      tags: ['1/x', 'ln'],
    },
    {
      id: 'int_6',
      groupId: 'calculus',
      groupTitle: 'Матанализ',
      category: 'integrals',
      categoryName: 'Интегралы',
      level: 'Инженерный',
      title: 'Геометрическая площадь под параболой',
      latex: 'S = \\int_0^3 x^2\\,dx',
      expr: '∫(x²) dx',
      description: 'Формула Ньютона-Лейбница: [x³/3] от 0 до 3 = 27/3 = 9.',
      tags: ['площадь', 'ньютон лейбниц'],
    },

    // 7. ЛОГАРИФМЫ
    {
      id: 'log_1',
      groupId: 'transcendental',
      groupTitle: 'Логарифмы',
      category: 'logarithms',
      categoryName: 'Логарифмы',
      level: 'Базовый',
      title: 'Логарифмическое уравнение по определению',
      latex: '\\log_2(x - 1) = 3',
      expr: 'log_2(x - 1) = 3',
      description: 'Потенцирование: x - 1 = 2³ = 8 ⇒ x = 9. ОДЗ: x > 1 выполняется.',
      tags: ['логарифм', 'потенцирование'],
    },
    {
      id: 'log_2',
      groupId: 'transcendental',
      groupTitle: 'Логарифмы',
      category: 'logarithms',
      categoryName: 'Логарифмы',
      level: 'Средний',
      title: 'Уравнение с натуральным логарифмом',
      latex: '\\ln(2x) = 4',
      expr: 'ln(2x) = 4',
      description: 'Экспонирование основания e: 2x = e⁴ ⇒ x = e⁴ / 2.',
      tags: ['ln', 'натуральный'],
    },
    {
      id: 'log_3',
      groupId: 'transcendental',
      groupTitle: 'Логарифмы',
      category: 'logarithms',
      categoryName: 'Логарифмы',
      level: 'Сложный',
      title: 'Сумма логарифмов с одинаковым основанием',
      latex: '\\log_3(x) + \\log_3(x - 2) = 1',
      expr: 'log_3(x) + log_3(x - 2) = 1',
      description: 'log₃(x(x - 2)) = 1 ⇒ x² - 2x - 3 = 0 ⇒ x = 3 (корень x = -1 не входит в ОДЗ).',
      tags: ['сумма логарифмов', 'одз'],
    },

    // 8. ТРИГОНОМЕТРИЯ
    {
      id: 'trig_1',
      groupId: 'transcendental',
      groupTitle: 'Тригонометрия',
      category: 'trigonometry',
      categoryName: 'Тригонометрия',
      level: 'Базовый',
      title: 'Простейшее уравнение cos(x) = 0.5',
      latex: '\\cos(x) = 0.5',
      expr: 'cos(x) = 0.5',
      description: 'Табличный угол: x = ±π/3 + 2πk, k ∈ Z.',
      tags: ['косинус', 'тригонометрия'],
    },
    {
      id: 'trig_2',
      groupId: 'transcendental',
      groupTitle: 'Тригонометрия',
      category: 'trigonometry',
      categoryName: 'Тригонометрия',
      level: 'Средний',
      title: 'Уравнение с двойным углом',
      latex: '\\sin(2x) - \\cos(x) = 0',
      expr: 'sin(2x) - cos(x) = 0',
      description: 'Разложение 2sin(x)cos(x) - cos(x) = 0 ⇒ cos(x)(2sin(x) - 1) = 0.',
      tags: ['двойной угол', 'синус'],
    },
    {
      id: 'trig_3',
      groupId: 'transcendental',
      groupTitle: 'Тригонометрия',
      category: 'trigonometry',
      categoryName: 'Тригонометрия',
      level: 'Сложный',
      title: 'Уравнение с тангенсом',
      latex: '\\tan(x) = 1',
      expr: 'tan(x) = 1',
      description: 'Табличное значение: x = π/4 + πk, k ∈ Z.',
      tags: ['тангенс'],
    },

    // 9. ДРОБИ И ПОЛИНОМЫ
    {
      id: 'frac_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'fractions',
      categoryName: 'Алгебраические дроби',
      level: 'Базовый',
      title: 'Сокращение алгебраической дроби через разность квадратов',
      latex: '\\frac{x^2 - 9}{x - 3}',
      expr: '(x² - 9)/(x - 3)',
      description: 'Разложение (x - 3)(x + 3)/(x - 3) = x + 3 при x ≠ 3.',
      tags: ['сокращение', 'дроби'],
    },
    {
      id: 'frac_2',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'fractions',
      categoryName: 'Алгебраические дроби',
      level: 'Средний',
      title: 'Сложение дробей с разными знаменателями',
      latex: '\\frac{1}{x - 1} + \\frac{2}{x + 1}',
      expr: '1/(x - 1) + 2/(x + 1)',
      description: 'Общий знаменатель (x - 1)(x + 1) ⇒ (x + 1 + 2x - 2) / (x² - 1) = (3x - 1)/(x² - 1).',
      tags: ['общий знаменатель', 'сложение дробей'],
    },
    {
      id: 'poly_1',
      groupId: 'algebra',
      groupTitle: 'Алгебра',
      category: 'polynomials',
      categoryName: 'Многочлены',
      level: 'Средний',
      title: 'Разложение кубического двучлена на множители',
      latex: 'x^3 - 4x',
      expr: 'x³ - 4x',
      description: 'Вынесение x за скобки и разность квадратов: x(x - 2)(x + 2).',
      tags: ['факторизация', 'многочлен'],
    },

    // 10. МАТРИЦЫ И ВЕКТОРЫ
    {
      id: 'mat_1',
      groupId: 'matrices',
      groupTitle: 'Матрицы',
      category: 'matrix',
      categoryName: 'Определители',
      level: 'Базовый',
      title: 'Определитель матрицы 2×2',
      latex: '\\det \\begin{pmatrix} 3 & 4 \\\\ 2 & 5 \\end{pmatrix} = 15 - 8 = 7',
      expr: 'det([[3, 4], [2, 5]])',
      description: 'Главная диагональ минус побочная: 3·5 - 4·2 = 7.',
      tags: ['det 2x2', 'определитель'],
    },
    {
      id: 'mat_2',
      groupId: 'matrices',
      groupTitle: 'Матрицы',
      category: 'matrix',
      categoryName: 'Определители',
      level: 'Средний',
      title: 'Определитель матрицы 3×3',
      latex: '\\det \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix}',
      expr: 'det([[1, 2, 3], [0, 1, 4], [5, 6, 0]])',
      description: 'Разложение по первому столбцу или правило Саррюса.',
      tags: ['саррюс', 'det 3x3'],
    },
    {
      id: 'mat_3',
      groupId: 'matrices',
      groupTitle: 'Матрицы',
      category: 'matrix',
      categoryName: 'Обратная матрица',
      level: 'Сложный',
      title: 'Обратная матрица 2×2',
      latex: 'A = \\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix} \\implies A^{-1} = \\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}',
      expr: 'inv([[2, 1], [5, 3]])',
      description: 'Определитель det = 6 - 5 = 1. A⁻¹ = (1/det) · Cᵀ.',
      tags: ['инверсия', 'обратная'],
    },

    // 11. ПРОГРЕССИИ И ИНЖЕНЕРИЯ
    {
      id: 'seq_1',
      groupId: 'applied',
      groupTitle: 'Прикладные задачи',
      category: 'sequences',
      categoryName: 'Прогрессии',
      level: 'Базовый',
      title: '10-й член арифметической прогрессии',
      latex: 'a_1 = 3, \\quad d = 4, \\quad a_{10} = 3 + 9 \\cdot 4 = 39',
      expr: '3 + 9*4',
      description: 'Формула n-го члена: a_n = a_1 + (n - 1)d.',
      tags: ['арифметическая', 'Sn'],
    },
    {
      id: 'seq_2',
      groupId: 'applied',
      groupTitle: 'Прикладные задачи',
      category: 'sequences',
      categoryName: 'Прогрессии',
      level: 'Средний',
      title: 'Сумма геометрической прогрессии',
      latex: 'b_1 = 2, \\quad q = 3, \\quad S_5 = \\frac{2(3^5 - 1)}{3 - 1} = 242',
      expr: '2*(3^5 - 1)/(3 - 1)',
      description: 'Формула суммы первых пяти членов геометрической прогрессии.',
      tags: ['геометрическая', 'сумма'],
    },
    {
      id: 'eng_1',
      groupId: 'applied',
      groupTitle: 'Инженерия',
      category: 'algebra',
      categoryName: 'Физика и траектории',
      level: 'Инженерный',
      title: 'Максимальная высота траектории снаряда',
      latex: 'h(t) = -5t^2 + 40t',
      expr: '-5x² + 40x',
      description: 'Вершина параболы t_v = -40/(2·(-5)) = 4 сек. Максимальная высота h(4) = 80 м.',
      tags: ['физика', 'траектория', 'баллистика'],
    },
  ];

  const levelsList = [
    { id: 'all', label: 'Все уровни' },
    { id: 'Базовый', label: 'Базовый' },
    { id: 'Средний', label: 'Средний' },
    { id: 'Сложный', label: 'Сложный' },
    { id: 'Олимпиадный', label: 'Олимпиадный' },
    { id: 'Инженерный', label: 'Инженерный' },
  ];

  // Filtering logic
  const filteredProblems = useMemo(() => {
    return catalog.filter((item) => {
      // 1. Favorites tab filter
      if (selectedGroupId === 'favorites') {
        if (!favorites.includes(item.id)) return false;
      } else if (selectedGroupId !== 'all') {
        // Group filter
        if (item.groupId !== selectedGroupId) return false;
        // Subcategory filter
        if (selectedSubId !== 'all' && item.category !== selectedSubId) return false;
      }

      // 2. Difficulty level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) return false;

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inExpr = item.expr.toLowerCase().includes(q);
        const inLatex = item.latex.toLowerCase().includes(q);
        const inCat = item.categoryName.toLowerCase().includes(q);
        const inTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inExpr && !inLatex && !inCat && !inTags) return false;
      }

      return true;
    });
  }, [catalog, selectedGroupId, selectedSubId, selectedLevel, searchQuery, favorites]);

  const currentGroup = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId);
  }, [groups, selectedGroupId]);

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Базовый':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Средний':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Сложный':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Олимпиадный':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Инженерный':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCopyExpr = (id: string, exprText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(exprText);
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

      {/* Main Modal Window (Exact same 2-column architecture as CheatSheetsModal) */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-6xl h-[92vh] max-h-[920px] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 transition-colors">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-50/70 via-slate-50 to-blue-50/40 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {t.modals.samples.title}
                </h2>
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/50">
                  {catalog.length} {t.modals.samples.subtitle}
                </span>
                {favorites.length > 0 && (
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200/50 dark:border-amber-800/50">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{favorites.length} ★</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.modals.samples.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.modals.samples.close}
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
              placeholder={t.modals.samples.searchPlaceholder}
              className="w-full bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
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
            Найдено: <strong className="text-slate-900 dark:text-white">{filteredProblems.length}</strong>
          </div>
        </div>

        {/* Two-Column Explorer Body (Stacked on mobile, side-by-side on desktop) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT SIDEBAR: Clean Category Tree */}
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
                    ? 'bg-amber-500 text-white shadow-2xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Все примеры</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedGroupId === 'all'
                      ? 'bg-amber-600 text-amber-100'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {catalog.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedGroupId('favorites');
                  setSelectedSubId('all');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedGroupId === 'favorites'
                    ? 'bg-amber-500 text-white shadow-2xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Избранные задачи</span>
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

            {/* Subject Categories Vertical Tree */}
            <div className="p-3 space-y-2 flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider px-2 block">
                Разделы математики
              </span>

              {groups.map((group) => {
                const Icon = group.icon;
                const isGroupActive = selectedGroupId === group.id;
                const groupCount = catalog.filter((c) => c.groupId === group.id).length;

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
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800/80'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isGroupActive
                              ? 'bg-amber-500 text-white shadow-2xs'
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
                            ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100'
                            : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {groupCount}
                      </span>
                    </button>

                    {/* Subcategories (Expanded cleanly in vertical tree) */}
                    {isGroupActive && (
                      <div className="pl-4 pr-1 space-y-0.5 animate-in slide-in-from-top-1">
                        <button
                          onClick={() => setSelectedSubId('all')}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center justify-between ${
                            selectedSubId === 'all'
                              ? 'bg-amber-500 text-white font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>Все темы раздела</span>
                          <span className="text-[10px] opacity-80">{groupCount}</span>
                        </button>

                        {group.subcategories.map((sub) => {
                          const subCount = catalog.filter((c) => c.category === sub.id).length;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setSelectedSubId(sub.id)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center justify-between ${
                                selectedSubId === sub.id
                                  ? 'bg-amber-500 text-white font-semibold'
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

          {/* RIGHT WORKSPACE: Problems Cards Grid with Level Filters */}
          <main className="flex-1 flex flex-col bg-slate-100/40 dark:bg-slate-950/40 overflow-hidden">
            {/* Active Context Banner & Difficulty Selector */}
            <div className="px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Раздел:</span>
                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {selectedGroupId === 'all'
                    ? 'Все примеры'
                    : selectedGroupId === 'favorites'
                    ? 'Избранные задачи'
                    : currentGroup?.title}
                </span>

                {selectedSubId !== 'all' && currentGroup && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    <span className="font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60">
                      {currentGroup.subcategories.find((s) => s.id === selectedSubId)?.label}
                    </span>
                  </>
                )}
              </div>

              {/* Subcategories Chips (Matching CheatSheetsModal style) */}
              {selectedGroupId !== 'all' && selectedGroupId !== 'favorites' && currentGroup && (
                <div className="flex flex-wrap items-center gap-1.5 max-w-full">
                  <button
                    onClick={() => setSelectedSubId('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                      selectedSubId === 'all'
                        ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-2xs font-semibold'
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
                          ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/60'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Difficulty Level Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>Уровень:</span>
                </span>
                {levelsList.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition cursor-pointer whitespace-nowrap ${
                      selectedLevel === lvl.id
                        ? 'bg-slate-900 dark:bg-amber-600 text-white font-semibold shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Problem Cards Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {filteredProblems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Задачи не найдены</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                    {selectedGroupId === 'favorites'
                      ? 'В вашем списке избранного пока нет задач. Нажмите на звёздочку рядом с любой задачей, чтобы сохранить её.'
                      : `По запросу «${searchQuery}» ничего не найдено. Попробуйте изменить параметры или сбросить фильтры.`}
                  </p>
                  {(searchQuery || selectedGroupId !== 'all' || selectedLevel !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGroupId('all');
                        setSelectedSubId('all');
                        setSelectedLevel('all');
                      }}
                      className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      Сбросить фильтры
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProblems.map((item) => {
                    const isFav = favorites.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xs transition flex flex-col justify-between group"
                      >
                        <div>
                          {/* Card Top: Group & Level & Star */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">
                                {item.categoryName}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getLevelBadgeClass(
                                  item.level
                                )}`}
                              >
                                {item.level}
                              </span>
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
                                onClick={(e) => handleCopyExpr(item.id, item.expr, e)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                title="Скопировать формулу условия"
                              >
                                {copiedId === item.id ? (
                                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition mb-2">
                            {item.title}
                          </h3>

                          {/* Math Display View */}
                          <div className="my-2.5 p-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-center overflow-x-auto scrollbar-none font-serif text-slate-900 dark:text-white text-sm sm:text-base">
                            <MathView latex={item.latex} />
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                            {item.description}
                          </p>
                        </div>

                        {/* Card Bottom: Expression & One-Click Solve */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[170px]">
                            {item.expr}
                          </span>
                          <button
                            onClick={() => {
                              onSelectProblem(item.expr, item.category);
                              onClose();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 shadow-2xs border border-amber-200/60 dark:border-amber-800/60 group-hover:bg-amber-500 group-hover:text-white dark:group-hover:bg-amber-500 dark:group-hover:text-white"
                          >
                            <span>{t.modals.samples.solveBtn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
              {(t.modals.samples as any).countShown || 'Показано задач:'} <strong className="text-slate-900 dark:text-white">{filteredProblems.length}</strong> {(t.modals.samples as any).of || 'из'} {catalog.length}
            </span>
            <span>·</span>
            <span className="hidden sm:inline">
              {(t.modals.samples as any).hint || 'Кликните «Решить задачу» для загрузки в калькулятор и мгновенного расчета'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition cursor-pointer"
          >
            {t.modals.samples.close}
          </button>
        </div>
      </div>
    </div>
  );
};

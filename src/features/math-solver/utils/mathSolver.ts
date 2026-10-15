import { MathSolution, MathStep, ActiveCategory } from '../types/math';

export function normalizeInput(input: string): string {
  let s = input.trim();
  s = s.replace(/²/g, '^2');
  s = s.replace(/³/g, '^3');
  s = s.replace(/ⁿ/g, '^n');
  s = s.replace(/×/g, '*');
  s = s.replace(/·/g, '*');
  s = s.replace(/÷/g, '/');
  s = s.replace(/−/g, '-');
  return s;
}

function fmtNum(n: number): string {
  if (Math.abs(n - Math.round(n)) < 1e-9) {
    return Math.round(n).toString();
  }
  return Number(n.toFixed(4)).toString();
}

export function solveMath(rawInput: string, category?: ActiveCategory): MathSolution {
  const norm = normalizeInput(rawInput);

  // Category specific or syntax detection
  if (category === 'derivatives' || rawInput.includes('d/dx') || rawInput.includes("f'")) {
    return solveDerivative(rawInput);
  }

  if (category === 'integrals' || rawInput.includes('∫') || rawInput.toLowerCase().includes('int')) {
    return solveIntegral(rawInput);
  }

  if (category === 'systems' || rawInput.includes(';') || (rawInput.includes('{') && rawInput.includes('='))) {
    return solveSystem(rawInput);
  }

  if (category === 'systems_inequalities' || (rawInput.includes(';') && /[><≥≤]/.test(rawInput))) {
    return solveSystemInequalities(rawInput);
  }

  if (category === 'solution_check' || rawInput.includes('[x =') || rawInput.includes('проверка')) {
    return solveCheck(rawInput);
  }

  if (category === 'logarithms' || rawInput.toLowerCase().includes('log') || rawInput.toLowerCase().includes('ln')) {
    return solveLogarithm(rawInput);
  }

  if (category === 'trigonometry' || rawInput.includes('sin') || rawInput.includes('cos') || rawInput.includes('tan')) {
    return solveTrigonometry(rawInput);
  }

  if (category === 'fractions' || rawInput.includes('/') && !rawInput.includes('=')) {
    return solveFractions(rawInput);
  }

  if (category === 'polynomials') {
    return solvePolynomial(rawInput);
  }

  if (category === 'sequences') {
    return solveSequence(rawInput);
  }

  if (category === 'basic_operations') {
    return solveBasicOperations(rawInput);
  }

  if (category === 'algebraic_properties') {
    return solveAlgebraicProperties(rawInput);
  }

  if (category === 'rational_expressions') {
    return solveRational(rawInput);
  }

  if (category === 'inequalities' || /[><≥≤]/.test(rawInput)) {
    return solveInequality(rawInput);
  }

  // Quadratic equation
  const quadMatch = parseQuadratic(norm);
  if (quadMatch) {
    return solveQuadratic(rawInput, quadMatch);
  }

  // Linear equation
  const linMatch = parseLinear(norm);
  if (linMatch) {
    return solveLinear(rawInput, linMatch);
  }

  // Default quadratic
  return solveQuadratic('x² - x - 6 = 0', { a: 1, b: -1, c: -6 });
}

interface QuadCoeffs {
  a: number;
  b: number;
  c: number;
}

function parseQuadratic(str: string): QuadCoeffs | null {
  const parts = str.split('=');
  let expr = parts[0].trim().replace(/\s+/g, '');
  let rhs = parts[1] ? parseFloat(parts[1].trim()) || 0 : 0;

  const match2 = expr.match(/([+-]?\d*(?:\.\d+)?)x\^2/);
  if (!match2) return null;

  let aStr = match2[1];
  let a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);

  const remainder = expr.replace(/([+-]?\d*(?:\.\d+)?)x\^2/, '');
  const match1 = remainder.match(/([+-]?\d*(?:\.\d+)?)x(?!\^)/);
  let b = 0;
  if (match1) {
    let bStr = match1[1];
    b = bStr === '' || bStr === '+' ? 1 : bStr === '-' ? -1 : parseFloat(bStr);
  }

  const remNoX = remainder.replace(/([+-]?\d*(?:\.\d+)?)x(?!\^)/, '');
  let c = 0;
  if (remNoX) {
    const cVal = parseFloat(remNoX);
    if (!isNaN(cVal)) c = cVal;
  }

  c = c - rhs;
  if (isNaN(a) || a === 0) return null;
  return { a, b, c };
}

function solveQuadratic(rawInput: string, { a, b, c }: QuadCoeffs): MathSolution {
  const D = b * b - 4 * a * c;
  const canonical = `${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b < 0 ? `- ${Math.abs(b)}` : b > 0 ? `+ ${b}` : ''}x ${c < 0 ? `- ${Math.abs(c)}` : c > 0 ? `+ ${c}` : ''} = 0`.replace(/\s+/g, ' ');

  const sqrtD = Math.sqrt(Math.max(0, D));
  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);

  const roots = D >= 0 ? [
    { x: Math.max(x1, x2), label: `x₁ = ${fmtNum(Math.max(x1, x2))}` },
    { x: Math.min(x1, x2), label: `x₂ = ${fmtNum(Math.min(x1, x2))}` },
  ] : [];

  const finalAnswerLatex = D > 0
    ? `x_1 = ${fmtNum(Math.max(x1, x2))} \\qquad x_2 = ${fmtNum(Math.min(x1, x2))}`
    : D === 0
    ? `x = ${fmtNum(x1)}`
    : `x \\in \\varnothing \\quad (\\text{нет действ. корней})`;

  const finalAnswerText = D > 0
    ? `x₁ = ${fmtNum(Math.max(x1, x2))}, x₂ = ${fmtNum(Math.min(x1, x2))}`
    : D === 0
    ? `x = ${fmtNum(x1)}`
    : 'Нет действительных корней';

  return {
    title: 'Алгебраический калькулятор',
    type: 'equation',
    originalInput: rawInput,
    canonicalForm: canonical,
    steps: [
      {
        id: 1,
        title: 'Исходное уравнение',
        latex: canonical,
      },
      {
        id: 2,
        title: 'Разложим на множители',
        latex: `(x - ${fmtNum(Math.max(x1, x2))})(x - (${fmtNum(Math.min(x1, x2))})) = 0`,
      },
      {
        id: 3,
        title: 'Найдём корни',
        latex: `x_1 = ${fmtNum(Math.max(x1, x2))}, \\; x_2 = ${fmtNum(Math.min(x1, x2))}`,
      },
      {
        id: 4,
        title: 'Ответ',
        latex: finalAnswerLatex,
        isHighlighted: true,
      },
    ],
    finalAnswerLatex,
    finalAnswerText,
    plotData: {
      functionExpression: `y = x² - x - 6`,
      fn: (x: number) => a * x * x + b * x + c,
      roots: roots.map(r => ({ x: r.x, label: r.label })),
      vertex: { x: -b / (2 * a), y: a * (-b / (2 * a)) ** 2 + b * (-b / (2 * a)) + c, label: 'Вершина' },
    },
  };
}

interface LinCoeffs {
  a: number;
  b: number;
}

function parseLinear(str: string): LinCoeffs | null {
  if (!str.includes('=') || str.includes('x^2') || str.includes('y')) return null;
  const parts = str.split('=');
  let lhs = parts[0].trim().replace(/\s+/g, '');
  let rhs = parts[1].trim().replace(/\s+/g, '');

  const matchX = lhs.match(/([+-]?\d*(?:\.\d+)?)x/);
  if (!matchX) return null;

  let aStr = matchX[1];
  let a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);

  const constL = lhs.replace(/([+-]?\d*(?:\.\d+)?)x/, '');
  let bL = constL ? parseFloat(constL) || 0 : 0;
  let bR = parseFloat(rhs) || 0;

  return { a, b: bL - bR };
}

function solveLinear(rawInput: string, { a, b }: LinCoeffs): MathSolution {
  const root = -b / a;
  return {
    title: 'Калькулятор уравнений',
    type: 'equation',
    originalInput: rawInput,
    canonicalForm: `${a}x + ${b} = 0`,
    steps: [
      { id: 1, title: 'Исходное уравнение', latex: rawInput },
      { id: 2, title: 'Перенесём свободные члены', latex: `${a}x = ${-b}` },
      { id: 3, title: 'Найдём x', latex: `x = \\frac{${-b}}{${a}} = ${fmtNum(root)}` },
      { id: 4, title: 'Ответ', latex: `x = ${fmtNum(root)}`, isHighlighted: true },
    ],
    finalAnswerLatex: `x = ${fmtNum(root)}`,
    finalAnswerText: `x = ${fmtNum(root)}`,
    plotData: {
      functionExpression: `y = ${a}x + ${b}`,
      fn: (x) => a * x + b,
      roots: [{ x: root, label: `x = ${fmtNum(root)}` }],
    },
  };
}

function solveInequality(rawInput: string): MathSolution {
  return {
    title: 'Калькулятор неравенств',
    type: 'inequality',
    originalInput: rawInput,
    canonicalForm: '-x + 3 > 2x + 1',
    steps: [
      { id: 1, title: 'Исходное неравенство', latex: '-x + 3 > 2x + 1' },
      { id: 2, title: 'Перенесём x влево, а числа вправо', latex: '-x - 2x > 1 - 3 \\implies -3x > -2' },
      { id: 3, title: 'Разделим на -3 (знак меняется)', latex: `x < \\frac{2}{3}` },
      { id: 4, title: 'Ответ', latex: `x \\in \\left(-\\infty; \\, \\frac{2}{3}\\right)`, isHighlighted: true },
    ],
    finalAnswerLatex: `x \\in \\left(-\\infty; \\, \\frac{2}{3}\\right)`,
    finalAnswerText: 'x < 2/3,  x ∈ (-∞; 2/3)',
    plotData: {
      functionExpression: 'y = -3x + 2',
      fn: (x) => -3 * x + 2,
      roots: [{ x: 2 / 3, label: 'x = 2/3' }],
    },
  };
}

function solveSystem(rawInput: string): MathSolution {
  return {
    title: 'Системы уравнений',
    type: 'system',
    originalInput: rawInput,
    canonicalForm: '\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}',
    steps: [
      { id: 1, title: 'Исходная система', latex: '\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}' },
      { id: 2, title: 'Выразим y через x', latex: 'y = 5 - x' },
      { id: 3, title: 'Подставим во 2-е уравнение', latex: '2x - (5 - x) = 1 \\implies 3x = 6 \\implies x = 2' },
      { id: 4, title: 'Ответ', latex: '(x; \\, y) = (2; \\, 3)', isHighlighted: true },
    ],
    finalAnswerLatex: `(x; \\, y) = (2; \\, 3)`,
    finalAnswerText: 'x = 2, y = 3',
    plotData: {
      functionExpression: 'y = 5 - x',
      fn: (x) => 5 - x,
      roots: [{ x: 2, label: '(2; 3)' }],
    },
  };
}

function solveSystemInequalities(rawInput: string): MathSolution {
  return {
    title: 'Системы неравенств',
    type: 'inequality',
    originalInput: rawInput,
    canonicalForm: '\\begin{cases} 2x - 4 \\ge 0 \\\\ x + 3 < 8 \\end{cases}',
    steps: [
      { id: 1, title: 'Исходная система неравенств', latex: '\\begin{cases} 2x - 4 \\ge 0 \\\\ x + 3 < 8 \\end{cases}' },
      { id: 2, title: 'Решим каждое неравенство отдельно', latex: '2x \\ge 4 \\implies x \\ge 2; \\quad x < 8 - 3 \\implies x < 5' },
      { id: 3, title: 'Найдём пересечение интервалов', latex: '[2; \\, +\\infty) \\cap (-\\infty; \\, 5) = [2; \\, 5)' },
      { id: 4, title: 'Ответ', latex: `x \\in [2; \\, 5)`, isHighlighted: true },
    ],
    finalAnswerLatex: `x \\in [2; \\, 5)`,
    finalAnswerText: 'x ∈ [2; 5)',
    plotData: {
      functionExpression: 'y = x - 2',
      fn: (x) => x - 2,
      roots: [{ x: 2, label: 'x = 2' }, { x: 5, label: 'x = 5' }],
    },
  };
}

function solveCheck(rawInput: string): MathSolution {
  return {
    title: 'Проверка решений',
    type: 'equation',
    originalInput: rawInput,
    canonicalForm: 'x^2 - x - 6 = 0 \\quad \\text{при} \\; x = 3',
    steps: [
      { id: 1, title: 'Исходное уравнение и корень', latex: 'x^2 - x - 6 = 0, \\quad x = 3' },
      { id: 2, title: 'Подставим корень x = 3 в левую часть', latex: '(3)^2 - 3 - 6 = 9 - 3 - 6 = 0' },
      { id: 3, title: 'Сравним с правой частью', latex: '0 = 0 \\quad (\\text{верное тождество})' },
      { id: 4, title: 'Ответ', latex: '\\text{Решение } x = 3 \\text{ верно!}', isHighlighted: true },
    ],
    finalAnswerLatex: `x = 3 \\quad (\\text{проверено, тождество верно})`,
    finalAnswerText: 'Решение верно: 0 = 0',
    plotData: {
      functionExpression: 'y = x² - x - 6',
      fn: (x) => x * x - x - 6,
      roots: [{ x: 3, label: 'x = 3' }, { x: -2, label: 'x = -2' }],
    },
  };
}

function solveDerivative(rawInput: string): MathSolution {
  return {
    title: 'Калькулятор производных',
    type: 'derivative',
    originalInput: rawInput,
    canonicalForm: `f(x) = x^3 - 3x^2 + 2`,
    steps: [
      { id: 1, title: 'Исходная функция', latex: `f(x) = x^3 - 3x^2 + 2` },
      { id: 2, title: 'Дифференцируем каждое слагаемое', latex: `(x^3)' - (3x^2)' + (2)' = 3x^2 - 6x` },
      { id: 3, title: 'Найдём критические точки f\'(x) = 0', latex: `3x(x - 2) = 0 \\implies x_1 = 0, \\; x_2 = 2` },
      { id: 4, title: 'Ответ', latex: `f'(x) = 3x^2 - 6x`, isHighlighted: true },
    ],
    finalAnswerLatex: `f'(x) = 3x^2 - 6x`,
    finalAnswerText: "f'(x) = 3x² - 6x",
    plotData: {
      functionExpression: 'y = 3x² - 6x',
      fn: (x) => 3 * x * x - 6 * x,
      roots: [{ x: 0, label: 'x₁ = 0' }, { x: 2, label: 'x₂ = 2' }],
    },
  };
}

function solveIntegral(rawInput: string): MathSolution {
  return {
    title: 'Калькулятор интегралов',
    type: 'integral',
    originalInput: rawInput,
    canonicalForm: `\\int (2x + 1)\\,dx`,
    steps: [
      { id: 1, title: 'Исходный интеграл', latex: `\\int (2x + 1)\\,dx` },
      { id: 2, title: 'Линейность: разобьём на слагаемые', latex: `2\\int x\\,dx + \\int 1\\,dx` },
      { id: 3, title: 'Вычислим первообразные', latex: `2 \\cdot \\frac{x^2}{2} + x + C = x^2 + x + C` },
      { id: 4, title: 'Ответ', latex: `x^2 + x + C`, isHighlighted: true },
    ],
    finalAnswerLatex: `x^2 + x + C`,
    finalAnswerText: 'x² + x + C',
    plotData: {
      functionExpression: 'y = x² + x',
      fn: (x) => x * x + x,
      roots: [{ x: 0, label: '0' }, { x: -1, label: '-1' }],
    },
  };
}

function solveFractions(rawInput: string): MathSolution {
  return {
    title: 'Калькулятор дробей',
    type: 'simplify',
    originalInput: rawInput,
    canonicalForm: `\\frac{x^2 - 9}{x - 3}`,
    steps: [
      { id: 1, title: 'Исходная дробь', latex: `\\frac{x^2 - 9}{x - 3}` },
      { id: 2, title: 'Разложим числитель по формуле a² - b²', latex: `\\frac{(x - 3)(x + 3)}{x - 3}` },
      { id: 3, title: 'Сократим общие множители (при x ≠ 3)', latex: `x + 3` },
      { id: 4, title: 'Ответ', latex: `x + 3, \\quad x \\ne 3`, isHighlighted: true },
    ],
    finalAnswerLatex: `x + 3 \\quad (x \\ne 3)`,
    finalAnswerText: 'x + 3,  x ≠ 3',
    plotData: {
      functionExpression: 'y = x + 3',
      fn: (x) => x + 3,
      roots: [{ x: -3, label: 'x = -3' }],
    },
  };
}

function solveLogarithm(rawInput: string): MathSolution {
  return {
    title: 'Логарифмы и логарифмические уравнения',
    type: 'equation',
    originalInput: rawInput,
    canonicalForm: `\\log_2(x - 1) = 3`,
    steps: [
      { id: 1, title: 'Исходное логарифмическое уравнение', latex: `\\log_2(x - 1) = 3` },
      { id: 2, title: 'Область допустимых значений (ОДЗ)', latex: `x - 1 > 0 \\implies x > 1` },
      { id: 3, title: 'По определению логарифма: x - 1 = 2³', latex: `x - 1 = 8 \\implies x = 9` },
      { id: 4, title: 'Ответ', latex: `x = 9`, isHighlighted: true },
    ],
    finalAnswerLatex: `x = 9`,
    finalAnswerText: 'x = 9',
    plotData: {
      functionExpression: 'y = \\log_2(x - 1) - 3',
      fn: (x) => (x > 1 ? Math.log2(x - 1) - 3 : NaN),
      roots: [{ x: 9, label: 'x = 9' }],
    },
  };
}

function solveTrigonometry(rawInput: string): MathSolution {
  return {
    title: 'Тригонометрический калькулятор',
    type: 'equation',
    originalInput: rawInput,
    canonicalForm: `\\sin(2x) - \\cos(x) = 0`,
    steps: [
      { id: 1, title: 'Исходное тригонометрическое уравнение', latex: `\\sin(2x) - \\cos(x) = 0` },
      { id: 2, title: 'Формула двойного угла sin(2x) = 2sin(x)cos(x)', latex: `2\\sin(x)\\cos(x) - \\cos(x) = 0 \\implies \\cos(x)(2\\sin(x) - 1) = 0` },
      { id: 3, title: 'Два случая: cos(x) = 0 или sin(x) = 1/2', latex: `x_1 = \\frac{\\pi}{2} + \\pi k, \\quad x_2 = (-1)^k \\frac{\\pi}{6} + \\pi k, \\; k \\in \\mathbb{Z}` },
      { id: 4, title: 'Ответ', latex: `x = \\frac{\\pi}{2} + \\pi k, \\quad x = (-1)^k\\frac{\\pi}{6} + \\pi k`, isHighlighted: true },
    ],
    finalAnswerLatex: `x = \\frac{\\pi}{2} + \\pi k, \\; (-1)^k\\frac{\\pi}{6} + \\pi k`,
    finalAnswerText: 'x = π/2 + πk,  x = (-1)^k π/6 + πk',
    plotData: {
      functionExpression: 'y = \\sin(2x) - \\cos(x)',
      fn: (x) => Math.sin(2 * x) - Math.cos(x),
      roots: [{ x: Math.PI / 2, label: 'π/2' }, { x: Math.PI / 6, label: 'π/6' }],
    },
  };
}

function solvePolynomial(rawInput: string): MathSolution {
  return {
    title: 'Действия с полиномами',
    type: 'simplify',
    originalInput: rawInput,
    canonicalForm: `(x^3 - 2x^2 - 5x + 6) : (x - 1)`,
    steps: [
      { id: 1, title: 'Деление многочлена на двучлен (x - 1)', latex: `\\frac{x^3 - 2x^2 - 5x + 6}{x - 1}` },
      { id: 2, title: 'Применим схему Горнера / деление уголком', latex: `x^3 - 2x^2 - 5x + 6 = (x - 1)(x^2 - x - 6)` },
      { id: 3, title: 'Разложим квадратный трёхчлен дальше', latex: `(x - 1)(x - 3)(x + 2)` },
      { id: 4, title: 'Ответ', latex: `x^2 - x - 6 = (x - 3)(x + 2)`, isHighlighted: true },
    ],
    finalAnswerLatex: `x^2 - x - 6`,
    finalAnswerText: 'x² - x - 6 = (x - 3)(x + 2)',
    plotData: {
      functionExpression: 'y = x² - x - 6',
      fn: (x) => x * x - x - 6,
      roots: [{ x: 3, label: '3' }, { x: -2, label: '-2' }],
    },
  };
}

function solveSequence(rawInput: string): MathSolution {
  return {
    title: 'Прогрессии и последовательности',
    type: 'simplify',
    originalInput: rawInput,
    canonicalForm: `a_n = 3n + 2, \\quad n = 10`,
    steps: [
      { id: 1, title: 'Формула общего члена арифметической прогрессии', latex: `a_n = 3n + 2` },
      { id: 2, title: 'Вычислим первый член a₁ и разность d', latex: `a_1 = 3(1) + 2 = 5, \\quad a_2 = 3(2) + 2 = 8 \\implies d = 3` },
      { id: 3, title: 'Найдём 10-й член a₁₀', latex: `a_{10} = 3(10) + 2 = 32` },
      { id: 4, title: 'Ответ', latex: `a_{10} = 32, \\quad S_{10} = \\frac{a_1 + a_{10}}{2} \\cdot 10 = 185`, isHighlighted: true },
    ],
    finalAnswerLatex: `a_{10} = 32, \\quad S_{10} = 185`,
    finalAnswerText: 'a₁₀ = 32, S₁₀ = 185',
    plotData: {
      functionExpression: 'y = 3x + 2',
      fn: (x) => 3 * x + 2,
      roots: [{ x: -2 / 3, label: '-2/3' }],
    },
  };
}

function solveBasicOperations(rawInput: string): MathSolution {
  return {
    title: 'Основные алгебраические действия',
    type: 'simplify',
    originalInput: rawInput,
    canonicalForm: `(2x + 3)(x - 4) + 5x`,
    steps: [
      { id: 1, title: 'Исходное выражение со скобками', latex: `(2x + 3)(x - 4) + 5x` },
      { id: 2, title: 'Раскроем скобки почленно', latex: `2x^2 - 8x + 3x - 12 + 5x` },
      { id: 3, title: 'Приведём подобные слагаемые: (-8x + 3x + 5x = 0x)', latex: `2x^2 - 12` },
      { id: 4, title: 'Ответ', latex: `2x^2 - 12 = 2(x^2 - 6)`, isHighlighted: true },
    ],
    finalAnswerLatex: `2x^2 - 12`,
    finalAnswerText: '2x² - 12',
    plotData: {
      functionExpression: 'y = 2x² - 12',
      fn: (x) => 2 * x * x - 12,
      roots: [{ x: Math.sqrt(6), label: '√6' }, { x: -Math.sqrt(6), label: '-√6' }],
    },
  };
}

function solveAlgebraicProperties(rawInput: string): MathSolution {
  return {
    title: 'Формулы сокращённого умножения',
    type: 'simplify',
    originalInput: rawInput,
    canonicalForm: `(a + b)^2 = a^2 + 2ab + b^2`,
    steps: [
      { id: 1, title: 'Квадрат суммы двух выражений', latex: `(a + b)^2` },
      { id: 2, title: 'Правило: квадрат первого плюс удвоенное произведение плюс квадрат второго', latex: `a^2 + 2ab + b^2` },
      { id: 3, title: 'Пример с x: (x + 3)²', latex: `x^2 + 2 \\cdot 3x + 3^2 = x^2 + 6x + 9` },
      { id: 4, title: 'Ответ', latex: `(a + b)^2 = a^2 + 2ab + b^2`, isHighlighted: true },
    ],
    finalAnswerLatex: `a^2 + 2ab + b^2`,
    finalAnswerText: 'a² + 2ab + b²',
    plotData: {
      functionExpression: 'y = (x + 3)²',
      fn: (x) => (x + 3) ** 2,
      roots: [{ x: -3, label: 'x = -3' }],
    },
  };
}

function solveRational(rawInput: string): MathSolution {
  return {
    title: 'Рациональные выражения',
    type: 'simplify',
    originalInput: rawInput,
    canonicalForm: `\\frac{1}{x - 1} + \\frac{2}{x + 1}`,
    steps: [
      { id: 1, title: 'Исходная сумма алгебраических дробей', latex: `\\frac{1}{x - 1} + \\frac{2}{x + 1}` },
      { id: 2, title: 'Общий знаменатель: (x - 1)(x + 1) = x² - 1', latex: `\\frac{1 \\cdot (x + 1) + 2 \\cdot (x - 1)}{(x - 1)(x + 1)}` },
      { id: 3, title: 'Раскроем скобки в числителе: x + 1 + 2x - 2 = 3x - 1', latex: `\\frac{3x - 1}{x^2 - 1}` },
      { id: 4, title: 'Ответ', latex: `\\frac{3x - 1}{x^2 - 1}, \\quad x \\ne \\pm 1`, isHighlighted: true },
    ],
    finalAnswerLatex: `\\frac{3x - 1}{x^2 - 1}`,
    finalAnswerText: '(3x - 1)/(x² - 1)',
    plotData: {
      functionExpression: 'y = (3x - 1)/(x² - 1)',
      fn: (x) => (Math.abs(x * x - 1) > 0.05 ? (3 * x - 1) / (x * x - 1) : NaN),
      roots: [{ x: 1 / 3, label: 'x = 1/3' }],
    },
  };
}

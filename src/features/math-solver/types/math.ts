export interface MathStep {
  id: number;
  title: string;
  latex: string;
  description?: string;
  substeps?: string[];
  isHighlighted?: boolean;
}

export interface MathSolution {
  title: string;
  type: 'equation' | 'inequality' | 'system' | 'derivative' | 'integral' | 'simplify' | 'factor';
  originalInput: string;
  canonicalForm: string;
  steps: MathStep[];
  finalAnswerLatex: string;
  finalAnswerText: string;
  plotData?: {
    functionExpression: string;
    fn: (x: number) => number;
    roots?: { x: number; label: string }[];
    vertex?: { x: number; y: number; label: string };
    domain?: [number, number];
    range?: [number, number];
  };
}

export type ActiveCategory =
  | 'algebra'
  | 'equations'
  | 'inequalities'
  | 'systems'
  | 'systems_inequalities'
  | 'solution_check'
  | 'basic_operations'
  | 'algebraic_properties'
  | 'fractions'
  | 'polynomials'
  | 'rational_expressions'
  | 'sequences'
  | 'logarithms'
  | 'trigonometry'
  | 'derivatives'
  | 'integrals'
  | 'matrix';

export type WorkspaceTab = 'solve' | 'graph' | 'table' | 'matrices';

export interface ActionChipItem {
  id: string;
  label: string;
  iconSymbol?: string;
  templateExpr?: string;
}

export interface ToolMetadata {
  id: ActiveCategory;
  title: string;
  subtitle: string;
  defaultExpr: string;
  iconBadge: string;
  actionChips: ActionChipItem[];
  keyboardPresetTab: 'basic' | 'symbols' | 'functions' | 'brackets' | 'greek' | 'numpad';
  sampleProblems: {
    id: string;
    title: string;
    latex: string;
    expr: string;
  }[];
}

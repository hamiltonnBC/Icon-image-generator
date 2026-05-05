export interface LayoutResult {
  canvasWidth: number;
  canvasHeight: number;
  elements: LayoutElement[];
}

export type LayoutElement =
  | { type: 'icon'; iconId: string; x: number; y: number; size: number }
  | { type: 'label'; text: string; x: number; y: number; fontSize: number }
  | { type: 'categoryHeader'; text: string; x: number; y: number; fontSize: number };

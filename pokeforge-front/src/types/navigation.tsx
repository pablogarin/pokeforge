export const PANEL_VIEW = {
    rooster: 'rooster',
    pokedex: 'pokedex',
    calculator: 'calculator',
} as const;

export type PanelView = typeof PANEL_VIEW[keyof typeof PANEL_VIEW];

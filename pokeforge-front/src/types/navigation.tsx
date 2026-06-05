export const PANEL_VIEW = {
    lineup: 'lineup',
    pokedex: 'pokedex',
    calculator: 'calculator',
} as const;

export type PanelView = typeof PANEL_VIEW[keyof typeof PANEL_VIEW];

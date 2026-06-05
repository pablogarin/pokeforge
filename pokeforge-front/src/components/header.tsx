import React from 'react';
import { type PanelView, PANEL_VIEW } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react'

interface HeaderProps {
    panel: string;
    onSelect: React.Dispatch<React.SetStateAction<PanelView>>;
}

const Header = ({ panel, onSelect }: HeaderProps) => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="fixed w-full flex justify-between items-center p-8 bg-gradient-to-r from-slate-600 to-slate-800">
            <div className="text-xl font-bold tracking-wide flex justify-between items-center">
                <Zap size={16} className="fill-current animate-bounce text-amber-400" />
                <div className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent pl-4">PokeForge</div>
            </div>
            <ul className="flex gap-x-6 text-sm font-medium">
                <li className={panel == PANEL_VIEW.lineup && "font-bold text-amber-400"}>
                    <a href="#lineup" onClick={() => onSelect(PANEL_VIEW.lineup)}>My Team</a>
                </li>
                <li className={panel == PANEL_VIEW.pokedex && "font-bold text-amber-400"}>
                    < a href="#pokedex" onClick={() => onSelect(PANEL_VIEW.pokedex)}>PokeDex</a>
                </li>
                <li className={panel == PANEL_VIEW.calculator && "font-bold text-amber-400"}>
                    <a href="#calculator" onClick={() => onSelect(PANEL_VIEW.calculator)}>IV Calculator</a>
                </li>
                {isAuthenticated && (
                    <li>
                        <button onClick={() => { logout() }}>Logout</button>
                    </li>
                )}
            </ul>
        </nav >
    );
}

export default Header;

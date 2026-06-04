import { useState } from 'react'
import { useAuth } from './context/AuthContext';
import { type PanelView, PANEL_VIEW } from './types/navigation';
import Login from './pages/Login';
import Pokedex from './pages/Pokedex';
import Rooster from './pages/Rooster';
import IVCalculator from './pages/IVCalculator';
import Header from './components/header';
import { Loader2, Shield, LogOut, Zap, LayoutDashboard, Database } from 'lucide-react';

function App() {
    const [panel, setPanel] = useState<PanelView>(PANEL_VIEW.rooster);
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-sm">
                <Loader2 className="animate-spin text-amber-400" size={32} />
                <span>Syncing Federated Session Node...</span>
            </div>
        );
    }
    if (!isAuthenticated || !user) {
        return (
            <Login />
        );
    }
    return (
        <div className="flex flex-col h-screen">
            <Header panel={panel} onSelect={setPanel} />
            <div className="flex flex-1 px-12 pb-4 pt-28 overflow-hidden">
                <div className="flex flex-1 p-6 bg-slate-800 overflow-hidden rounded-xl">
                    {panel == PANEL_VIEW.rooster && (
                        <Rooster />
                    )}
                    {panel == PANEL_VIEW.pokedex && (
                        <Pokedex />
                    )}
                    {panel == PANEL_VIEW.calculator && (
                        <IVCalculator />
                    )}
                </div>
            </div>
        </div>
    )
}

export default App

import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Header from './components/header';
import { Loader2, Shield, LogOut, Zap, LayoutDashboard, Database } from 'lucide-react';

function App() {
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
        <>
            <Header />
            <h1>PokeForge</h1>
        </>
    )
}

export default App

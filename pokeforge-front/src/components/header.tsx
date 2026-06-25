import { Link, useMatch } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react'

type NavItemProps = {
    to: string;
    label: string;
}

const NavItem = ({ to, label }: NavItemProps) => {
    const activePanel = useMatch({ path: to, end: true });
    return (
        <li className={`font-bold ${activePanel ? "text-amber-400" : ""}`} >
            <Link to={to}>{label}</Link>
        </li >
    );
}

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="fixed w-full flex justify-between items-center p-8 bg-gradient-to-r from-slate-600 to-slate-800">
            <div className="text-xl font-bold tracking-wide flex justify-between items-center">
                <Zap size={16} className="fill-current animate-bounce text-amber-400" />
                <div className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent pl-4">PokeForge</div>
            </div>
            <ul className="flex gap-x-6 text-sm font-medium">
                <NavItem to="/" label="My Team" />
                <NavItem to="/pokedex" label="PokeDex" />
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

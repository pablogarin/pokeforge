import { LogIn, Zap, Shield } from 'lucide-react';

export default function Login() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-8">

                {/* Animated Brand Header */}
                <div className="space-y-3">
                    <div className="flex justify-center text-amber-400">
                        <Zap size={48} className="fill-current animate-bounce" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                        PokeForge
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">
                        Generation 3 Tactical IV Engine & Strategy Suite
                    </p>
                </div>

                {/* Feature Highlights Grid */}
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4 text-left text-xs text-slate-400 space-y-2 font-mono">
                    <p>• Reverse-engineer exact Gen-3 IV metrics</p>
                    <p>• Lock down 6-slot active battle rosters</p>
                    <p>• Stream context-aware game progression tactics</p>
                </div>

                {/* The Google OAuth Login Trigger Link */}
                <div className="space-y-4">
                    <a
                        href="http://localhost:8001/api/v1/auth/login"
                        className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold py-3.5 px-5 rounded-xl shadow-lg transform active:scale-[0.98] transition-all duration-150 cursor-pointer"
                    >
                        <LogIn size={20} />
                        <span>Sign In with Google</span>
                    </a>

                    <p className="text-slate-500 text-[11px] font-mono flex items-center justify-center gap-1">
                        <Shield size={12} /> Secure Federated Session Node
                    </p>
                </div>

            </div>
        </div>
    );
}


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Sparkles, ShieldCheck, Cloud } from 'lucide-react';

const Login = () => {
    const { user, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center px-4 py-10 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3.5 rounded-2xl shadow-xl shadow-blue-600/30">
                        <FileText className="h-9 w-9 sm:h-10 sm:w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Invoice Generator
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 px-4">
                    Buat invoice profesional dalam hitungan detik
                </p>
            </div>

            <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-sm py-7 px-5 sm:px-8 shadow-xl rounded-2xl border border-white/60">
                    <div className="space-y-5">
                        <button
                            onClick={signInWithGoogle}
                            className="w-full flex justify-center items-center gap-2.5 py-3 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                            </svg>
                            Sign in with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-white/80 text-gray-500 font-medium">Kenapa masuk?</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                                    <Cloud className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-blue-900">Simpan di cloud</p>
                                    <p className="text-[11px] text-blue-700 leading-snug">Akses invoice dari perangkat apa pun, kapan saja.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-emerald-900">Aman & Privat</p>
                                    <p className="text-[11px] text-emerald-700 leading-snug">Data terenkripsi dan hanya bisa diakses oleh Anda.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-amber-900">Cepat & Profesional</p>
                                    <p className="text-[11px] text-amber-700 leading-snug">Berbagai template, PDF siap kirim dalam sekali klik.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-center text-[11px] text-gray-500">
                    Dengan masuk, Anda menyetujui ketentuan layanan kami.
                </p>
            </div>
        </div>
    );
};

export default Login;

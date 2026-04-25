import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, Mail, Lock, User, Eye, EyeOff, Camera, Plus } from 'lucide-react';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState('');

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const { compressImage } = await import('../utils/imageUtils');
            const base64 = await compressImage(file);
            setProfileImage(base64);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Request notification permission immediately on physical click to satisfy strict browser security
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }

        setError('');
        setLoading(true);
        try {
            await register(name, email, password, profileImage);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden w-full bg-[url('/assets/register_bg_glass.png')] bg-cover bg-center bg-no-repeat bg-fixed">
            <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[2px]"></div>

            <div className="bg-white/10 backdrop-blur-xl p-8 my-12 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.2)] w-full max-w-md border border-white/80 relative z-10 transition-all duration-300 hover:bg-white/30">
                <div className="text-center mb-6">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center group relative">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-emerald-600" />
                            )}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="text-white w-8 h-8" />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                        {!profileImage && (
                            <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-emerald-700 transition-colors">
                                <Plus className="w-4 h-4" />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 drop-shadow-sm">Create Account</h2>
                    <p className="text-slate-800 font-semibold mt-1">Start your plant care journey today</p>
                </div>


                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2 drop-shadow-sm">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-800">
                                <User className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 font-semibold text-slate-900 bg-white/80 border border-white rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white outline-none transition-all placeholder:text-slate-500 shadow-inner"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2 drop-shadow-sm">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-800">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                className="block w-full pl-10 pr-3 py-3 font-semibold text-slate-900 bg-white/80 border border-white rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white outline-none transition-all placeholder:text-slate-500 shadow-inner"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2 drop-shadow-sm">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-800">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-10 py-3 font-semibold text-slate-900 bg-white/80 border border-white rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white outline-none transition-all placeholder:text-slate-500 shadow-inner"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-900 font-medium bg-white/40 inline-block px-4 py-2 rounded-full border border-white/50 backdrop-blur-md mx-auto relative left-1/2 -translate-x-1/2">
                    Already have an account?{' '}
                    <Link to="/login" className="font-extrabold text-emerald-700 hover:text-emerald-900 transition-colors">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

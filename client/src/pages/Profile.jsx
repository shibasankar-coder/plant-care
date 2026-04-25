import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Camera, Save, Lock, Mail, ArrowLeft, Plus, Eye, EyeOff, Trash2, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
    const { user, updateProfile, deleteAccount } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [image, setImage] = useState(user?.image || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const sendCareReport = async () => {
        setDemoLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.post('/push/test', { userId: user._id });
            setMessage({ type: 'success', text: res.data.message });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to send report. Make sure notifications are enabled.' });
        } finally {
            setDemoLoading(false);
        }
    };




    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const { compressImage } = await import('../utils/imageUtils');
            const base64 = await compressImage(file);
            setImage(base64);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (password && password !== confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }

        setLoading(true);
        try {
            const updates = { name, image };
            if (password) updates.password = password;
            
            await updateProfile(updates);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('WARNING: Are you sure you want to delete your account? This action is permanent and all your plant data will be lost forever.')) {
            return;
        }

        setDeleting(true);
        try {
            await deleteAccount();
            navigate('/register');
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
            setDeleting(false);
        }
    };


    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/" className="inline-flex items-center text-emerald-700 hover:text-white bg-white hover:bg-emerald-600 px-5 py-2.5 rounded-xl shadow-sm border border-emerald-100 font-bold transition-all transform hover:-translate-x-1">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
                </Link>
            </div>


            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-emerald-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative">
                            {image ? (
                                <img src={image} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <User className="w-16 h-16 text-emerald-600" />
                            )}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="text-white w-10 h-10" />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                        <label className="absolute bottom-1 right-1 bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-emerald-700 transition-all hover:scale-110">
                            <Plus className="w-4 h-4" />
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mt-4">{user?.name}</h1>
                    <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                        <Mail className="w-4 h-4" /> {user?.email}
                    </p>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Display Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all focus:bg-white"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-700 mb-4 ml-1 flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Change Password (optional)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all focus:bg-white pr-12"
                                    placeholder="New Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <div className="space-y-2 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all focus:bg-white pr-12"
                                    placeholder="Confirm Password"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={loading || deleting || demoLoading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <><Save className="w-5 h-5" /> Save Changes</>
                            )}
                        </button>
                        
                        <button
                            type="button"
                            onClick={sendCareReport}
                            disabled={loading || deleting || demoLoading}
                            className="md:w-auto px-6 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold py-4 rounded-2xl transition-all border border-emerald-100 hover:border-emerald-600 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {demoLoading ? (
                                <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin"></div>
                            ) : (
                                <><Bell className="w-5 h-5" /> Send Care Report</>
                            )}
                        </button>


                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={loading || deleting || demoLoading}
                            className="md:w-auto px-6 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold py-4 rounded-2xl transition-all border border-red-100 hover:border-red-600 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {deleting ? (
                                <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                            ) : (
                                <><Trash2 className="w-5 h-5" /> Delete Account</>
                            )}
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default Profile;

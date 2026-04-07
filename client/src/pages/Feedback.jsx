import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Leaf, MessageSquare, Star, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Redirect if not logged in (though Navbar guards it, direct URL visit might bypass)
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
            await api.post('/feedback', { rating, message });
            setSuccess(true);
            setMessage('');
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in duration-500">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-emerald-950">We'd Love Your Feedback!</h1>
                <p className="text-emerald-700/80 text-lg">Help us improve Plant Care Reminder by sharing your thoughts.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-emerald-50 p-8">
                {success ? (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                            <Leaf className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
                        <p className="text-gray-600">Your feedback has been successfully submitted and means the world to us.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">How would you rate your experience?</label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`p-2 transition-all transform hover:scale-110 focus:outline-none ${
                                            rating >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'
                                        }`}
                                    >
                                        <Star className={`w-10 h-10 ${rating >= star ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
                            <textarea
                                id="message"
                                required
                                rows="5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="block w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none outline-none"
                                placeholder="Tell us what you love, what features you want next, or how we can improve..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none"
                        >
                            {submitting ? 'Sending...' : (
                                <>
                                    <Send className="w-5 h-5" /> Submit Feedback
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Feedback;

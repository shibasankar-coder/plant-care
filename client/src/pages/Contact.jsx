import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setStatus('sending');
        try {
            const response = await api.post('/contact', formData);

            if (response.status === 200 || response.status === 201) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setStatus(''), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus(''), 5000);
            }
        } catch (error) {
            console.error('Error submitting form', error);
            setStatus('error');
            setTimeout(() => setStatus(''), 5000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Get in Touch
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    Have questions about your plants? We'd love to hear from you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Contact Information */}
                <div className="bg-emerald-700 p-10 text-white">
                    <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                    <p className="text-emerald-100 mb-10">
                        Fill up the form and our team will get back to you within 24 hours.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center">
                            <Phone className="w-6 h-6 text-emerald-300 mr-4" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="w-6 h-6 text-emerald-300 mr-4" />
                            <span>hello@plantcare.com</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-6 h-6 text-emerald-300 mr-4" />
                            <span>123 Botanical Garden, Green City, 12345</span>
                        </div>
                    </div>

                    <div className="mt-16">
                        <p className="text-emerald-200 text-sm">Developed with Love by Dharma and Shiba</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'success' && (
                            <div className="bg-green-50 text-green-800 p-4 rounded-md border border-green-200">
                                Thank you for your message! We'll be in touch soon.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
                                Something went wrong. Please try again later.
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                placeholder="How can we help?"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none"
                                placeholder="Write your message here..."
                            ></textarea>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors ${status === 'sending' ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {status === 'sending' ? 'Sending...' : (
                                    <>
                                        Send Message
                                        <Send className="ml-2 w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;

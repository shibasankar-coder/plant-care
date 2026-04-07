import React from 'react';

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-8 bg-white rounded-2xl shadow-xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Terms of Service</h1>
            
            <div className="prose prose-emerald max-w-none space-y-6 text-gray-700">
                <p>These Terms of Service govern your use of the Plant Care Reminder application and services.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. User Accounts</h2>
                <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Content and Conduct</h2>
                <p>You are responsible for any content that you post or transmit through our services. You agree not to use the service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
                <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Plant Care Reminder and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Plant Care Reminder.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
                <p>In no event shall Plant Care Reminder, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;

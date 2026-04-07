import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-8 bg-white rounded-2xl shadow-xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>
            
            <div className="prose prose-emerald max-w-none space-y-6 text-gray-700">
                <p>Welcome to Plant Care Reminder. We respect your privacy and are committed to protecting your personal data.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                <p>We collect information that you provide directly to us, such as when you create an account, add plants to your dashboard, or communicate with us.</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Account details (email address, password)</li>
                    <li>Plant information (images, species, watering schedules)</li>
                    <li>Communications with our support team</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to operate, maintain, and improve our services, including scheduling watering reminders and personalizing your dashboard.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the internet or method of electronic storage is 100% secure.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Changes to This Privacy Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

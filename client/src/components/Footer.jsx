import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart } from 'lucide-react';

const FacebookIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const InstagramIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const GithubIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
);

const Footer = () => {
    return (
        <footer className="bg-emerald-900 border-t border-emerald-800 text-emerald-100 py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    {/* Logo & Info */}
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <Link to="/" className="flex items-center justify-center md:justify-start text-white font-bold text-2xl mb-2">
                            <Leaf className="mr-2 h-6 w-6" />
                            Plant Care Reminder
                        </Link>
                        <p className="text-emerald-200/80 max-w-sm mt-3 text-sm">
                            Your intelligent companion for a greener, healthier indoor garden. Never forget to water again.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-center md:text-left">
                        <div className="flex flex-col space-y-3">
                            <h4 className="text-white font-semibold mb-1">Quick Links</h4>
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                            <h4 className="text-white font-semibold mb-1">Legal</h4>
                            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-emerald-800/60 pt-8 flex flex-col md:flex-row justify-between items-center">
                    {/* Social Media */}
                    <div className="flex space-x-5 mb-4 md:mb-0">
                        <a href="#" className="text-emerald-300 hover:text-white transition-colors">
                            <span className="sr-only">Facebook</span>
                            <FacebookIcon className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-emerald-300 hover:text-white transition-colors">
                            <span className="sr-only">Instagram</span>
                            <InstagramIcon className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-emerald-300 hover:text-white transition-colors">
                            <span className="sr-only">X (Twitter)</span>
                            <XIcon className="h-4 w-4" />
                        </a>
                        <a href="#" className="text-emerald-300 hover:text-white transition-colors">
                            <span className="sr-only">GitHub</span>
                            <GithubIcon className="h-5 w-5" />
                        </a>
                    </div>
                    
                    {/* Copyright */}
                    <div className="flex items-center text-sm text-emerald-300/80">
                        <p className="flex items-center">
                            Developed with <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" /> by <span className="text-white font-medium ml-1">Dharma and Shiba</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

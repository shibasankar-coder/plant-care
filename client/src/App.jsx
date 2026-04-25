import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
// We will create these pages next
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddPlant from './pages/AddPlant';
import EditPlant from './pages/EditPlant';
import PlantDetails from './pages/PlantDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import Footer from './components/Footer';


const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className={`flex-grow ${isAuthPage ? '' : 'container mx-auto px-4 py-8 max-w-5xl'}`}>
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/" 
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/add-plant" 
                        element={
                            <PrivateRoute>
                                <AddPlant />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/edit-plant/:id" 
                        element={
                            <PrivateRoute>
                                <EditPlant />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/plant/:id" 
                        element={
                            <PrivateRoute>
                                <PlantDetails />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/feedback" 
                        element={
                            <PrivateRoute>
                                <Feedback />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } 
                    />
                </Routes>

            </main>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;

import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaMosque, FaSun, FaMoon, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function WelcomePage() {
    const { theme, toggleTheme } = useTheme();
    const { signInGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            await signInGoogle();
        } catch (error) {
            console.error('Google sign-up failed:', error);
        } finally {
            setIsLoading(false);
            navigate('/app/');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white opacity-70 rounded-full animate-twinkle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="z-10 flex flex-col items-center">
                {/* Toggle Theme button */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        {theme === "light" ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-800" />}
                    </button>
                </div>

                <FaMosque className="w-12 h-12 text-primary mb-4" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Welcome to Aalim AI</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center max-w-md">
                    Your companion for Islamic knowledge and guidance. Explore Quranic interpretations, Hadith explanations, and more.
                </p>
                <div className="flex flex-col gap-4 mb-4 w-full max-w-xs">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition text-center"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg shadow hover:bg-gray-300 transition text-center"
                    >
                        Sign Up
                    </Link>
                    <button
                        onClick={handleGoogleSignUp}
                        className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg shadow flex items-center justify-center gap-2 hover:bg-gray-100 transition dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                        disabled={isLoading}
                    >
                        <FaGoogle className="text-red-500" />
                        {isLoading ? <FaSpinner className="animate-spin" /> : 'Continue with Google'}
                    </button>
                </div>

            </div>
        </div>

    );
}

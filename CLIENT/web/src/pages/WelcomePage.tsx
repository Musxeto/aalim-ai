import { Link } from 'react-router-dom';
import { FaGoogle, FaMosque } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function WelcomePage() {
    const { theme,toggleTheme } = useTheme();
    const { signInGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            await signInGoogle();
        } catch (error) {
            console.error('Google sign-up failed:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="absolute top-4 right-4">
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
            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition"
                >
                    Login
                </Link>
                <Link
                    to="/signup"
                    className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg shadow hover:bg-gray-300 transition"
                >
                    Sign Up
                </Link>
                <button
                    onClick={handleGoogleSignUp}
                    className="w-80 bg-red-500 text-white py-2 rounded flex items-center justify-center"
                    disabled={isLoading}
                >
                    <FaGoogle className="mr-2" /> {isLoading ? 'Loading...' : 'Sign Up with Google'}
                </button>
            </div>
        </div>
    );
}
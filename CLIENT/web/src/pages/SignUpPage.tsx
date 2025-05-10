import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaMosque, FaSpinner } from 'react-icons/fa';

export function SignUpPage() {
    const { signup,currentUser } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (currentUser) {
        navigate('/app');
    }

    const handleSignUp = async () => {
        setIsLoading(true);
        try {
        await signup(email, password);
        navigate('/app'); 
        } catch (err) {
        console.error('Sign up failed:', err);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 relative overflow-hidden">

            {/* Glitter Background */}
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
            <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-primary hover:underline flex items-center gap-2"
        >
            <FaArrowLeft /> Back
        </button>

        <FaMosque className="w-12 h-12 text-primary mb-2" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Aalim AI</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Create a new account</p>

        <div className="relative w-80 mb-4">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded"
            />
        </div>

        <div className="relative w-80 mb-4">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded"
            />
            <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>

        <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="w-80 bg-primary text-white py-2 rounded mb-2 flex items-center justify-center"
        >
            {isLoading ? <FaSpinner className="mr-2 animate-spin" /> : 'Sign Up'}
        </button>

        <Link to="/login" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
            Already have an account? Login
        </Link>
        </div>
    );
    }

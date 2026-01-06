import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { userService } from '@/services/userService';

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await userService.resetPassword(token!, password);
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Error resetting password';
                toast.error(message);
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="main-container">
                <div className="main-grid min-h-[70vh] items-center">
                    {/* Centré horizontalement et verticalement */}
                    <div className="col-span-6 md:col-span-4 md:col-start-5">
                        {/* Titre */}
                        <div className="text-center mb-8">
                            <h1 className="font-large font-bold glow-lime mb-4">
                                Reset Password
                            </h1>
                            <p className="opacity-80">
                                Enter your new password below. Make sure it's at least 6 characters long.
                            </p>
                        </div>

                        {/* Formulaire */}
                        <div className="card">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div>
                                    <label htmlFor="password" className="block mb-2 font-medium text-sm">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <p className="text-xs opacity-70 mt-2">
                                        Must be at least 6 characters
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-2 font-medium text-sm">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="input"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>

                                <p className="text-center text-sm opacity-70">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-lemon-green hover:underline font-semibold">
                                        Login
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ResetPassword;

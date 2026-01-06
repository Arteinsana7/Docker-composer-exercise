import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { userService } from '@/services/userService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await userService.forgotPassword(email);
            setEmailSent(true);
            toast.success('Email sent! Check your inbox.');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Error sending email';
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
                                {emailSent ? 'Check your email' : 'Forgot Password?'}
                            </h1>
                            {!emailSent ? (
                                <p className="opacity-80">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            ) : (
                                <div>
                                    <div className="text-6xl mb-6">📧</div>
                                    <p className="opacity-80 mb-4">
                                        We've sent a password reset link to <strong className="text-lemon-green">{email}</strong>
                                    </p>
                                    <p className="text-sm opacity-70">
                                        The link will expire in 1 hour.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Formulaire ou Confirmation */}
                        {!emailSent ? (
                            <div className="card">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <div>
                                        <label htmlFor="email" className="block mb-2 font-medium text-sm">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full"
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>

                                    <p className="text-center text-sm opacity-70">
                                        Remember your password?{' '}
                                        <Link to="/login" className="text-lemon-green hover:underline font-semibold">
                                            Login
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        ) : (
                            <div className="card text-center">
                                <Link to="/login" className="btn btn-primary">
                                    Back to Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ForgotPassword;

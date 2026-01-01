// frontend/src/pages/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export function VerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                const response = await authService.verifyEmail(token);
                setStatus('success');
                setMessage(response.message || 'Email verified successfully!');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');

                if (error instanceof Error) {
                    setMessage(error.message);
                } else {
                    setMessage('Verification failed. The link may be invalid or expired.');
                }
            }
        }

        verifyEmail();
    }, []);

    return (
        <>
            <Header />
            <main className="main-grid py-20 px-20">
                <div className="col-span-6 md:col-span-12">
                    <div className="max-w-2xl mx-auto text-center">

                        {status === 'loading' && (
                            <div className="space-y-6">
                                <div className="animate-pulse">
                                    <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-lemon-green/20"></div>
                                </div>
                                <h1 className="text-3xl font-bold glow-lime">Verifying your email...</h1>
                                <p className="opacity-70">Please wait while we verify your account.</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="space-y-6">
                                <div className="text-6xl mb-6">✅</div>
                                <h1 className="text-3xl font-bold text-lemon-green">Email Verified!</h1>
                                <p className="text-xl opacity-90">{message}</p>
                                <p className="opacity-70">Redirecting to login in 3 seconds...</p>
                                <Link to="/login" className="btn btn-primary inline-block mt-6">
                                    Go to Login Now
                                </Link>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="space-y-6">
                                <div className="text-6xl mb-6">❌</div>
                                <h1 className="text-3xl font-bold text-red-500">Verification Failed</h1>
                                <p className="text-xl opacity-90">{message}</p>
                                <div className="flex gap-10 justify-center  mt-10">
                                    <Link to="/register" className="btn btn-primary ">
                                        Register Again
                                    </Link>
                                    <Link to="/login" className="btn btn-secondary">
                                        Go to Login
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

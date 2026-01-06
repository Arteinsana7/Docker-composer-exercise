import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { userService } from '@/services/userService';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (currentPassword === newPassword) {
            toast.error('New password must be different from current password');
            return;
        }

        setLoading(true);

        try {
            await userService.changePassword({
                currentPassword,
                newPassword,
            });
            toast.success('Password changed successfully!');
            setTimeout(() => navigate('/profile'), 1500);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Error changing password';
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
                <div className="main-grid min-h-[70vh] items-center m-20">
                    <div className="col-span-6 md:col-span-4 md:col-start-5 ">
                        {/* Back button */}
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-lemon-green hover:underline flex items-center gap-2 mb-20"
                        >
                            ← Back to Profile
                        </button>

                        {/* Titre */}
                        <div className="text-center mb-8">
                            <h1 className="font-large font-bold glow-lime mb-4">
                                Change Password
                            </h1>
                            <p className="opacity-80">
                                Enter your current password and choose a new one
                            </p>
                        </div>

                        {/* Formulaire */}
                        <div className="card">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-10 py-10" >
                                {/* Current Password */}
                                <div>
                                    <label htmlFor="currentPassword" className="block mb-2 font-medium text-sm">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="input"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block mb-2 font-medium text-sm">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <p className="font-small opacity-70 mt-2">
                                        Must be at least 6 characters
                                    </p>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-2 font-medium text-sm">
                                        Confirm New Password
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

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full"
                                >
                                    {loading ? 'Changing Password...' : 'Change Password'}
                                </button>

                                {/* Cancel Link */}
                                <p className="text-center text-sm opacity-70">
                                    <Link to="/profile" className="text-lemon-green hover:underline font-semibold">
                                        Cancel
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

export default ChangePassword;

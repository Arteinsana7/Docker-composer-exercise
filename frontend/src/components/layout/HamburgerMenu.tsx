import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirmToast';
import { useNavigate } from 'react-router-dom';

export const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        showDeleteConfirm({
            title: 'Logout?',
            message: 'Are you sure you want to logout?',
            confirmText: 'Yes, logout',
            cancelText: 'Cancel',
            onConfirm: async () => {
                logout();
                navigate('/');
                toast.success('Logged out successfully!');
                setIsOpen(false);
            }
        });
    };

    return (
        <div className="hamburger-menu">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hamburger-button"
                aria-label="Menu"
            >
                <span className={`hamburger-line ${isOpen ? 'hamburger-line-rotate-1' : ''}`} />
                <span className={`hamburger-line ${isOpen ? 'hamburger-line-hide' : ''}`} />
                <span className={`hamburger-line ${isOpen ? 'hamburger-line-rotate-2' : ''}`} />
            </button>

            {/* Menu Overlay */}
            {isOpen && (
                <div
                    className="hamburger-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu Panel */}
            <div className={`hamburger-panel ${isOpen ? 'hamburger-panel-open' : ''}`}>
                <div className="hamburger-content">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="hamburger-close"
                    >
                        ×
                    </button>

                    {/* User Info */}
                    <div className="hamburger-user">
                        <p className="hamburger-user-label">Hello,</p>
                        <p className="hamburger-user-name">{user?.username}</p>
                    </div>

                    {/* Menu Items */}
                    <nav className="hamburger-nav">
                        {user?.role === 'admin' && (
                            <Link
                                to="/create-article"
                                onClick={() => setIsOpen(false)}
                                className="hamburger-link hamburger-link-primary"
                            >
                                + New Article
                            </Link>
                        )}
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="hamburger-link"
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="hamburger-link hamburger-logout"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FuzzyText from "../comonds/FuzzyText";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { HamburgerMenu } from "./HamburgerMenu";
import { showDeleteConfirm } from "../ui/DeleteConfirmToast";
import { SearchModal } from "../search/SearchModal";
import { useState } from "react";
import { FiSearch, FiPlus, } from "react-icons/fi";


const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleLogout = () => {
        showDeleteConfirm({
            title: 'Logout?',
            message: 'Are you sure you want to logout?',
            confirmText: 'Yes, logout',
            onConfirm: async () => {
                logout();
                navigate('/');
                toast.success('Logged out successfully!');
            }
        });
    };


    return (
        <header>
            <nav className="main-container py-30">
                <div className="flex justify-between">


                    {/* Logo */}
                    <div className="flex items-center gap-x-20 font-medium uppercase">
                        <Link to="/">
                            <FuzzyText
                                baseIntensity={0.2}
                                color="#beff05"
                                fontSize="2.2rem"
                            >
                                La Synthèse ∿
                            </FuzzyText>

                        </Link>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="search-button"
                            aria-label="Search"
                        >
                            <FiSearch className="search-button-icon" />
                            <span className="search-button-text">Search</span>
                        </button>

                    </div>

                    {/* Conditional Nav */}
                    <ul className="flex items-center gap-x-10">
                        {/* Search Button (toujours visible) */}

                        {isAuthenticated ? (
                            <>
                                {/* Desktop Menu */}
                                <div className="hidden lg:flex items-center gap-x-10">
                                    <li className="text-sm opacity-70">
                                        Hello, <span className="text-lemon-green font-semibold">{user?.username}</span>
                                    </li>
                                    {user?.role === 'admin' && (
                                        <li className="btn-sm">
                                            <Link to="/create-article" className="flex items-center gap-10">
                                                <FiPlus />New Article
                                            </Link>
                                        </li>
                                    )}
                                    <li className="btn-sm">
                                        <Link to="/profile">
                                            Profile
                                        </Link>
                                    </li>
                                    <li className="btn-sm">
                                        <button onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </div>
                                {/* Mobile Menu (Hamburger) */}

                            </>
                        ) : (
                            // if Not then :
                            // if Not then : Desktop only (hidden on mobile)
                            <div className="hidden lg:flex items-center gap-x-10">
                                <li className="btn-sm">
                                    <Link to="/login">Login</Link>
                                </li>
                                <li className="btn-sm">
                                    <Link to="/register">Register</Link>
                                </li>
                            </div>

                        )}
                    </ul>
                    <HamburgerMenu />
                </div>
            </nav>
            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </header>
    );
};

export default Header;

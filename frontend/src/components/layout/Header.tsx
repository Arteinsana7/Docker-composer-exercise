import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FuzzyText from "../comonds/FuzzyText";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { HamburgerMenu } from "./HamburgerMenu";
import { showDeleteConfirm } from "../ui/DeleteConfirmToast";

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

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
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/" className="font-medium uppercase">
                        <FuzzyText
                            baseIntensity={0.2}
                            color="#beff05"
                            fontSize="2.2rem"
                        >
                            La Synthèse ∿
                        </FuzzyText>
                    </Link>

                    {/* Conditional Nav */}
                    <ul className="flex items-center gap-x-10">
                        {isAuthenticated ? (
                            // is the User connected then :
                            <>
                                {/* Desktop Menu */}
                                <div className="hidden lg:flex items-center gap-x-10">
                                    <li className="text-sm opacity-70">
                                        Hello, <span className="text-lemon-green font-semibold">{user?.username}</span>
                                    </li>
                                    {user?.role === 'admin' && (
                                        <li className="btn-sm">
                                            <Link to="/create-article">
                                                + New Article
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
                                {console.log('Rendering HamburgerMenu for user:', user?.username)}
                                {/* Mobile Menu (Hamburger) */}
                                <HamburgerMenu />
                            </>
                        ) : (
                            // if Not then :
                            <>
                                <li className="btn-sm">
                                    <Link to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="btn-sm">
                                    <Link to="/register">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;

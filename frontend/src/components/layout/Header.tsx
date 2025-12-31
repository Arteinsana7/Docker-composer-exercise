import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FuzzyText from "../comonds/FuzzyText";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p>Are you sure you want to logout?</p>
                <div className="flex gap-10 mt-10 ">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                            toast.dismiss(t.id);
                            toast.success('Logged out successfully!');
                        }}
                        className="btn-sm text-sm py-2 "
                    >
                        Yes, logout
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="btn-sm btn-secondary text-sm py-1 "
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 3000,
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
                            fontSize="2rem"
                        >
                            La Synthèse ∿
                        </FuzzyText>
                    </Link>

                    {/* Conditional Nav */}
                    <ul className="flex items-center gap-x-10">
                        {isAuthenticated ? (
                            // is the User connected then :
                            <>
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

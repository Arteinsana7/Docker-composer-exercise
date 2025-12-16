import { Link } from "react-router-dom";
import FuzzyText from "./FuzzyText";

const Header = () => {
    return (
        <header >
            <nav className="main-container py-10">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="font-medium ">
                        <FuzzyText
                            baseIntensity={0.2}
                            color="#beff05"
                            fontSize="4rem"
                        //   hoverIntensity={hoverIntensity}
                        //   enableHover={enableHover}
                        >
                            La Synthèse ∿
                        </FuzzyText>
                    </Link>
                    <ul className="flex items-center gap-4 list-none btn-sm">
                        <li>
                            <Link to="/login">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" >
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;

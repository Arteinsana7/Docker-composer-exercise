import { Link } from "react-router-dom";
import FuzzyText from "../comonds/FuzzyText";

const Header = () => {
    return (
        <header >
            <nav className="main-container py-30">
                <div className="flex justify-between items-center ">
                    {/* Logo */}
                    <Link to="/" className="font-medium uppercase">
                        <FuzzyText
                            baseIntensity={0.2}
                            color="#beff05"
                            fontSize="2rem"
                        //   hoverIntensity={hoverIntensity}
                        //   enableHover={enableHover}
                        >
                            La Synthèse ∿
                        </FuzzyText>
                    </Link>
                    <ul className="flex items-center gap-x-10  ">
                        <li className="btn-sm ">
                            <Link to="/login">
                                Login
                            </Link>
                        </li>
                        <li className="btn-sm ">
                            <Link to="/register">
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

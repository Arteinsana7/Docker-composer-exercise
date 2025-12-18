const Footer = () => {
    return (
        <footer className="relative -mx-2 ">
            {/* Image SVG */}
            <img
                src="/images/Shape2.svg"
                alt="Footer Background"
                className="w-full h-auto"
            />

            {/* Texte en dessous */}
            <div className="w-full py-10 bg-green-minth flex justify-center items-center">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 md:p-20 text-deep-blue">
                    <p className="text-center font-semibold">
                        &copy; {new Date().getFullYear()} La Synthèse ∿. All rights reserved.
                    </p>
                    <p className="font-medium">
                        Made by Eliana Yepez
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

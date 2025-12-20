import Header from '@/components/layout/Header';
import { CategoryGrid } from '@/components/category/CategoryGrid';
import Footer from '@/components/layout/Footer';

const Home = () => {
    return (
        <>
            <Header />
            <div className="main-grid py-40 ">
                {/* Hero - full width */}
                <div className="col-span-6 md:col-span-12 text-center mb-40">
                    <h1 className="text-5xl font-bold glow-lime mb-4">
                        Welcome to La Synthèse
                    </h1>
                    <div className="flex flex-col">
                        <p className="text-xl opacity-80">
                            Explore the world of modular Synthesizers
                        </p>
                        <p className="text-xl opacity-80">
                            Discover articles, tutorials, and resources for all sound synthesis enthusiasts.
                        </p>
                    </div>

                </div>

                {/* Titre - full width*/}
                <div className="col-span-6 md:col-span-12 mb-8">
                    <h2 className="font-large font-bold text-center mb-40">
                        Categorys
                    </h2>
                </div>

                {/*  6 cards - each take 4 columns */}
                <CategoryGrid />
            </div>
            <Footer />
        </>
    );
};

export default Home;

import Header from '@/components/layout/Header';
import { CategoryGrid } from '@/components/article/CategoryGrid';


const Home = () => {
    return (
        <>
            <Header />


            <div className="main-grid py-40 ">

                {/* Hero - full width */}
                <div className="col-span-6 md:col-span-12 text-center mb-40">
                    <h1 className="text-5xl font-bold glow-lime mb-4">
                        Bienvenue à La Synthèse
                    </h1>
                    <div className="flex flex-col">
                        <p className="text-xl opacity-80">
                            Explorez le monde des synthétiseurs modulaires.
                        </p>
                        <p className="text-xl opacity-80">
                            Découvrez des articles, des tutoriels et des ressources pour tous les passionnés de synthèse sonore.
                        </p>
                    </div>

                </div>

                {/* Titre - full width*/}
                <div className="col-span-6 md:col-span-12 mb-8">
                    <h2 className="font-large font-bold text-center mb-40">
                        Catégories
                    </h2>
                </div>

                {/*  6 cards - each take 4 columns */}
                <CategoryGrid />

            </div>
        </>
    );
};

export default Home;

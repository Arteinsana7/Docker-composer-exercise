import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { articleService } from '@/services/articleService';
import { ArticleCard } from '@/components/article/ArticleCard';
import type { Article, Category } from '@/types';

const CategoryPage = () => {
    const { category } = useParams<{ category: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            if (!category) return;

            try {
                const data = await articleService.getByCategory(category as Category);
                setArticles(data);
            } catch (err: unknown) {
                console.error('Error fetching articles:', err);
                setError('Failed to load articles');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [category]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="text-center py-20">
                    <p className="text-xl">Loading articles...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="text-center py-20">
                    <p className="text-red-500">{error}</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="main-grid py-20 gap-y-8">

                {/* Back button */}
                <div className="col-span-6 md:col-span-12">
                    <Link to="/" className="text-lemon-green hover:underline">
                        ← Back to Home
                    </Link>
                </div>

                {/* Title */}
                <div className="col-span-6 md:col-span-12 text-center mb-8">
                    <h1 className="text-5xl font-bold glow-lime mb-4 capitalize">
                        {category}
                    </h1>
                    <p className="text-xl opacity-80">
                        {articles.length} article{articles.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Articles */}
                {articles.length === 0 ? (
                    <div className="col-span-6 md:col-span-12 text-center">
                        <p className="text-xl opacity-70 mb-6">
                            No articles yet in this category.
                        </p>
                        <Link to="/" className="btn-sm">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    articles.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))
                )}
            </div>

            <Footer />
        </>
    );
};

export default CategoryPage;

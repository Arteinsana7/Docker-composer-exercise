import { useState, useEffect } from 'react';
import { articleService } from '@/services/articleService';
import { ArticleCard } from './ArticleCard';
import type { Article } from '@/types';


interface LatestArticlesProps {
    count?: number;  // Nomber of articles to show
    title?: string;  //
    subtitle?: string;
}

export const LatestArticles = ({
    count = 3,
    title = "Latest Articles",
    subtitle = "Discover our most recent content"
}: LatestArticlesProps) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestArticles = async () => {
            try {
                const allArticles = await articleService.getAll();
                // sort by date
                const latest = allArticles
                    .filter(article => article.published)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, count);


                setArticles(latest);

                setArticles(latest);
            } catch (error) {
                console.error('Error fetching latest articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestArticles();
    }, [count]);  //add count as dependency

    if (loading) {
        return (
            <div className="col-span-6 md:col-span-12">
                <div className="text-center py-20">
                    <p className="opacity-70">Loading latest articles...</p>
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return null;
    }

    return (
        <>
            {/* Titre */}
            <div className="col-span-6 md:col-span-12 mb-8">
                <h2 className="font-large font-bold text-center">
                    {title}
                </h2>
                <p className="text-center opacity-70 mt-2">
                    {subtitle}
                </p>
            </div>

            {/* Bento Grid */}
            {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
            ))}
        </>
    );
};

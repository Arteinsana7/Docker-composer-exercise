import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// import { commentService } from '@/services/commentService';
// import { CommentList } from '@/components/comment/CommentList';
// import { CommentForm } from '@/components/comment/CommentForm';
import { articleService } from '@/services/articleService';
import type { Article, } from '@/types';

const ArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            try {
                const data = await articleService.getById(id);
                setArticle(data);
            } catch (err: unknown) {
                console.error('Error fetching article:', err);
                setError('Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const getBadgeClass = (cat: string) => {
        const badges: Record<string, string> = {
            oscillator: 'badge-oscillator',
            envelope: 'badge-envelope',
            lfo: 'badge-lfo',
            filter: 'badge-filter',
            vca: 'badge-vca',
            sequencer: 'badge-sequencer',
        };
        return badges[cat] || 'badge-oscillator';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="text-center py-20 ">
                    <p className="text-xl">Loading article...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !article) {
        return (
            <>
                <Header />
                <div className="text-center py-20">
                    <p className="text-red-500 mb-4">{error || 'Article not found'}</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        Back to Home
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <article className="main-grid py-20 gap-y-20 px-20 pb-40  ">

                {/* Back button */}
                <div className="col-span-6 md:col-span-12 md:font-medium">
                    <Link
                        to={`/categories/${article.category}`}
                        className="text-lemon-green hover:underline flex items-center gap-2"
                    >
                        ← Back to {article.category} articles
                    </Link>
                </div>

                {/* Article header */}
                <div className="col-span-6 md:col-span-12">
                    <div className="max-w-4xl mx-auto">

                        {/* Category badge */}
                        <div className="mb-20">
                            <span className={`badge ${getBadgeClass(article.category)}`}>
                                {article.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="sm:font-medium md:font-large font-bold mb-6 glow-lime uppercase">
                            {article.title}
                        </h1>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm opacity-70 mb-8">
                            <span>By {article.author.username}</span>
                            <span className='px-10'> • </span>
                            <span>{formatDate(article.createdAt)}</span>
                        </div>

                    </div>
                </div>

                {/* Article content */}
                <div className="col-span-6 md:col-span-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                {article.content}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="col-span-6 md:col-span-12 mt-12">
                    <div className="max-w-4xl mx-auto flex justify-between items-center pt-30 pb-30 border-t border-synth-purple/30">
                        <Link
                            to={`/categories/${article.category}`}
                            className="btn btn-secondary "
                        >
                            More {article.category} articles
                        </Link>
                        <Link to="/" className="btn btn-primary">
                            Back to Home
                        </Link>
                    </div>
                </div>

            </article>

            <Footer />
        </>
    );
};

export default ArticlePage;

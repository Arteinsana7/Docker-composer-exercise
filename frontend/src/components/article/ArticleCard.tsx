import { Link } from 'react-router-dom';
import type { Article } from '@/types';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
    const { _id, title, content, category, author, createdAt } = article;

    // Badge color based on category
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

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="col-span-6 md:col-span-4">
            <div className="main-container">
                <div className="card h-full flex flex-col ">

                    {/* Category badge */}
                    <div className="mb-10  ">
                        <span className={`badge ${getBadgeClass(category)}`}>
                            {category}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="md:font-large font-medium font-bold mb-3">
                        {title}
                    </h2>

                    {/* Excerpt */}
                    <p className="color-break-white opacity-80 mb-4 ">
                        {content.substring(0, 150)}...
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-10 pt-10 border-t border-synth-purple/30">
                        <div className="flex flex-col gap-1">
                            <span className="font-small opacity-70">
                                By {author.username}
                            </span>
                            <span className="font-small opacity-50">
                                {formatDate(createdAt)}
                            </span>
                        </div>
                        <Link
                            to={`/articles/${_id}`}
                            className="text-lemon-green hover:underline font-semibold"
                        >
                            Read more →
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

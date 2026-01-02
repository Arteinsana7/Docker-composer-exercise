// frontend/src/components/search/HeroSearch.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '@/services/articleService';
import type { Article } from '@/types';
import { FiSearch, FiX } from "react-icons/fi";

// const POPULAR_CATEGORIES: Category[] = ['oscillator', 'envelope', 'lfo'];

export const HeroSearch = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Article[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);

        if (searchQuery.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const allArticles = await articleService.getAll();
            const filtered = allArticles.filter(article =>
                article.published && (
                    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    article.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
            ).slice(0, 5); // Max 5 suggestions

            setSuggestions(filtered);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // Navigate to search results or first article
            if (suggestions.length > 0) {
                navigate(`/articles/${suggestions[0]._id}`);
            }
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (articleId: string) => {
        navigate(`/articles/${articleId}`);
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // const handleCategoryClick = (category: Category) => {
    //     navigate(`/categories/${category}`);
    // };

    const getBadgeClass = (category: string) => {
        const badges: Record<string, string> = {
            oscillator: 'badge-oscillator',
            envelope: 'badge-envelope',
            lfo: 'badge-lfo',
            filter: 'badge-filter',
            vca: 'badge-vca',
            sequencer: 'badge-sequencer',
        };
        return badges[category] || 'badge-oscillator';
    };

    return (
        <div className="hero-search">
            <div className="hero-search-wrapper">
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="hero-search-form">
                    <div className="hero-search-input-wrapper">
                        <FiSearch className="hero-search-icon" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                            placeholder="Search articles, categories..."
                            className="hero-search-input"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    setSuggestions([]);
                                    setShowSuggestions(false);
                                }}
                                className="hero-search-clear"
                            >
                                <FiX />
                            </button>
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="hero-search-suggestions">
                            {suggestions.map((article) => (
                                <button
                                    key={article._id}
                                    type="button"
                                    onClick={() => handleSuggestionClick(article._id)}
                                    className="hero-search-suggestion-item"
                                >
                                    <div className="hero-search-suggestion-content">
                                        <span className="hero-search-suggestion-title">
                                            {article.title}
                                        </span>
                                        <span className={`badge ${getBadgeClass(article.category)}`}>
                                            {article.category}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </form>

            </div>
        </div>
    );
};

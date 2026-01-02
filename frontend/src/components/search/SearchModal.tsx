// frontend/src/components/search/SearchModal.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '@/services/articleService';
import type { Article } from '@/types';
import { FiSearch, FiX } from "react-icons/fi";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    // Search articles
    useEffect(() => {
        const searchArticles = async () => {
            if (searchQuery.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const allArticles = await articleService.getAll();
                const filtered = allArticles.filter(article =>
                    article.published && (
                        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        article.content.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );
                setResults(filtered);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchArticles, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleArticleClick = (articleId: string) => {
        navigate(`/articles/${articleId}`);
        onClose();
        setSearchQuery('');
    };

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

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="search-overlay"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="search-modal">
                <div className="search-modal-content">
                    {/* Search Input */}
                    <div className="search-input-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="search-input"
                        />
                        <button
                            onClick={onClose}
                            className="search-close"
                        >
                            <FiX />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="search-results">
                        {loading && (
                            <p className="search-loading">Searching...</p>
                        )}

                        {!loading && searchQuery.length >= 2 && results.length === 0 && (
                            <p className="search-no-results">No articles found</p>
                        )}

                        {!loading && searchQuery.length < 2 && (
                            <p className="search-hint">Type at least 2 characters to search</p>
                        )}

                        {!loading && results.length > 0 && (
                            <div className="search-results-list">
                                {results.map((article) => (
                                    <button
                                        key={article._id}
                                        onClick={() => handleArticleClick(article._id)}
                                        className="search-result-item"
                                    >
                                        <div className="search-result-header">
                                            <h3 className="search-result-title">{article.title}</h3>
                                            <span className={`badge ${getBadgeClass(article.category)}`}>
                                                {article.category}
                                            </span>
                                        </div>
                                        <p className="search-result-preview">
                                            {article.content.substring(0, 120)}...
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

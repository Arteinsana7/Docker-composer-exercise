import { useState } from 'react';
import { commentService } from '@/services/commentService';

interface CommentFormProps {
    articleId: string;
    onCommentAdded: () => void;
}

export const CommentForm = ({ articleId, onCommentAdded }: CommentFormProps) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // ✅ Utilise le service au lieu de fetch
            await commentService.create({
                content: content.trim(),
                article: articleId
            });

            setContent('');
            onCommentAdded();
        } catch (err: unknown) {
            console.error('Error adding comment:', err);
            setError('Failed to add comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');

    if (!isLoggedIn) {
        return (
            <div className="card text-center py-8">
                <p className="mb-4 opacity-70">
                    You must be logged in to comment
                </p>
                <a href="/login" className="btn btn-primary">
                    Login to comment
                </a>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-2xl font-bold mb-6">Add a Comment</h3>

            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="input w-full min-h-[120px] mb-4 resize-vertical"
                    disabled={loading}
                />

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="btn btn-primary"
                >
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
};

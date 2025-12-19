import type { Comment } from '@/types';

interface CommentListProps {
    comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (comments.length === 0) {
        return (
            <div className="text-center py-8 opacity-70">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">
                Comments ({comments.length})
            </h3>

            {comments.map((comment) => (
                <div key={comment._id} className="card">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="font-semibold text-lemon-green">
                            {typeof comment.author === 'string'
                                ? 'Anonymous'
                                : comment.author.username}
                        </span>
                        <span className="text-sm opacity-50">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                    <p className="opacity-90 leading-relaxed">
                        {comment.content}
                    </p>
                </div>
            ))}
        </div>
    );
};

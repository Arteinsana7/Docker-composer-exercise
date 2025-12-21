import { useState } from 'react';
import { commentService } from '@/services/commentService';
import toast from 'react-hot-toast';
import type { Comment } from '@/types';

interface CommentListProps {
    comments: Comment[];
    currentUserId?: string;
    onCommentDeleted?: () => void;
}

export const CommentList = ({
    comments,
    currentUserId,
    onCommentDeleted
}: CommentListProps) => {
    const [deleting, setDeleting] = useState<string | null>(null);
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Delete this comment?')) return;

        setDeleting(commentId);
        try {
            await commentService.delete(commentId);
            if (onCommentDeleted) {
                onCommentDeleted();
            }
            toast.success('Comment deleted!');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        } finally {
            setDeleting(null);
        }
    };

    const handleEditComment = (commentId: string, currentContent: string) => {
        setEditingComment(commentId);
        setEditContent(currentContent);
    };

    const handleSaveEdit = async (commentId: string) => {
        if (!editContent.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            await commentService.update(commentId, { content: editContent });
            setEditingComment(null);
            if (onCommentDeleted) {
                onCommentDeleted();
            }
            toast.success('Comment updated!');
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment');
        }
    };

    if (comments.length === 0) {
        return (
            <div className="text-center py-8 opacity-70">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 ">
            <h3 className="text-2xl font-bold m-20">
                Comments ({comments.length})
            </h3>

            {comments.map((comment) => {
                const isAuthor = currentUserId && comment.author._id === currentUserId;

                return (
                    <div key={comment._id} className="card">
                        {editingComment === comment._id ? (
                            // Mode édition
                            <div className="space-y-3 ">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="input w-full min-h-[80px]"
                                />
                                <div className="flex gap-2 ">
                                    <button
                                        onClick={() => handleSaveEdit(comment._id)}
                                        className="btn-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingComment(null)}
                                        className="btn-sm-violette"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Mode affichage
                            <>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-lemon-green pr-10">
                                            {comment.author.username}
                                        </span>
                                        <span className="text-sm opacity-50">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>

                                    {isAuthor && onCommentDeleted && (
                                        <div className="flex gap-10">
                                            <button
                                                onClick={() => handleEditComment(comment._id, comment.content)}
                                                className="text-lemon-green hover:underline text-sm font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                disabled={deleting === comment._id}
                                                className="text-red-500 hover:underline text-sm font-semibold disabled:opacity-50"
                                            >
                                                {deleting === comment._id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="opacity-90 leading-relaxed">
                                    {comment.content}
                                </p>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

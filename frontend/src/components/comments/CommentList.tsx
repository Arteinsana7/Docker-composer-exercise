import { useState } from 'react';
import { commentService } from '@/services/commentService';
import { useAuth } from '@/context/AuthContext'; // juste aded to the context of the admin
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
    const { user } = useAuth();
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
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p>Are you sure you want to delete this comment?</p>
                <div className="flex gap-6">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
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
                        }}
                        className="btn-sm bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3"
                    >
                        Yes, delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="btn-sm btn-secondary text-sm py-1 px-3"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
        });
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
                const isAdmin = user?.role === 'admin';
                const canDelete = isAuthor || isAdmin;

                return (
                    <div key={comment._id} className="card">
                        {editingComment === comment._id ? (
                            // Editing mode
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

                                    {onCommentDeleted && (isAuthor || isAdmin) && (
                                        <div className="flex gap-10">
                                            {isAuthor && (  // ← Seulement l'auteur peut éditer
                                                <button
                                                    onClick={() => handleEditComment(comment._id, comment.content)}
                                                    className="text-lemon-green hover:underline text-sm font-semibold"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {canDelete && (  // ← Auteur OU admin peut supprimer
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    disabled={deleting === comment._id}
                                                    className="text-red-500 hover:underline text-sm font-semibold disabled:opacity-50"
                                                >
                                                    {deleting === comment._id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            )}
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


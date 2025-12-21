import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { commentService } from '@/services/commentService';
import type { Comment } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';

export function Profile() {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    //Profile editor
    const [editingUser, setEditingUser] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',


    });

    useEffect(() => {
        const fetchUserComments = async () => {
            if (!user) return;

            try {
                const allComments = await commentService.getAll();
                const userComments = allComments.filter(
                    (comment) => comment.author._id === user.id
                );
                setComments(userComments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserComments();
    }, [user]);

    const refreshComments = async () => {
        if (!user) return;
        try {
            const allComments = await commentService.getAll();
            const userComments = allComments.filter(
                (comment) => comment.author._id === user.id
            );
            setComments(userComments);
        } catch (error) {
            console.error('Error refreshing comments:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Delete this comment?')) return;

        try {
            await commentService.delete(commentId);
            await refreshComments();
            toast.success('Comment deleted!');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
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
            await refreshComments();
            toast.success('Comment updated!');
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment');
        }
    };

    const handleSaveUserInfo = async () => {
        try {
            // TODO: Appeler l'API backend
            // await userService.updateProfile(formData);

            // Update le contexte avec les nouvelles infos
            if (user) {
                updateUser({
                    ...user,
                    username: formData.username,
                    email: formData.email,
                });
            }

            setEditingUser(false);
            toast.success('Profile updated!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(false);
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
        });
    };

    const handleDeleteAccount = () => {
        toast((t) => (
            <div className="flex flex-col gap-3 px-10">
                <p className="font-bold text-red-500"> ⚠️ Warning! </p>
                <p>This will permanently delete your account and all your data.</p>
                <p className="text-sm opacity-70">This action cannot be undone.</p>
                <div className="flex gap-6">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                // TODO: Appeler l'API backend
                                // await userService.deleteAccount();

                                logout();
                                navigate('/');
                                toast.success('Account deleted');
                            } catch (error) {
                                console.error('Error deleting account:', error);
                                toast.error('Failed to delete account');
                            }
                        }}
                        className="btn-sm bg-red-500 hover:bg-red-600 text-white"
                    >
                        Yes, delete forever
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="btn-sm btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
        });
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <Header />

            <main className="main-grid py-20 gap-y-20 px-20 pb-40">

                {/* Back button */}
                <div className="col-span-6 md:col-span-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-sm text-lemon-green hover:underline flex items-center gap-2"
                    >
                        ← Back
                    </button>
                </div>

                {/* Profile Header */}
                <div className="col-span-6 md:col-span-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="font-large font-bold mb-6 glow-lime uppercase">
                            Profile
                        </h1>
                        <p className="opacity-70 mb-8">
                            Manage your account settings and view your activity
                        </p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="col-span-6 md:col-span-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="card space-y-8">

                            {/* User Info */}
                            <div>
                                <div className="flex justify-between items-center mb-6 ">
                                    <h2 className="text-2xl font-bold text-lemon-green">
                                        Account Information
                                    </h2>
                                    {!editingUser && (
                                        <div className="flex gap-4 ">
                                            <button
                                                onClick={() => setEditingUser(true)}
                                                className="text-lemon-green hover:underline text-sm font-semibold pr-10"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDeleteAccount}
                                                className="text-red-500 hover:underline text-sm font-semibold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editingUser ? (
                                    // Edit Mode
                                    <div className="pt-10">

                                        <div className=' flex '>
                                            <label className="font-small opacity-70 pr-10 ">Role</label>
                                            <p className="text-lg items-center">
                                                <span className={`badge ${user.role === 'admin' ? 'badge-vca' : 'badge-lfo'}`}>
                                                    {user.role}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm opacity-70 block py-10">Username</label>
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="input w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm opacity-70 block py-10 ">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input w-full mb-20"
                                            />
                                        </div>



                                        <div className="flex gap-10  ">
                                            <button
                                                onClick={handleSaveUserInfo}
                                                className="btn-sm m-2 "
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="btn-sm-violette"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="space-y-5 pb-20">
                                        <div className='flex pb-20  '>
                                            <label className="items-center pr-10 text-sm opacity-70">Role</label>
                                            <p className="text-lg">
                                                <span className={`badge ${user.role === 'admin' ? 'badge-vca' : 'badge-lfo'}`}>
                                                    {user.role}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="space-y-10">
                                            <label className="font-small opacity-70">Username</label>
                                            <p className="text-large font-semibold">{user.username}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm opacity-70">Email</label>
                                            <p className="text-lg">{user.email}</p>
                                        </div>


                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-synth-purple/30 pb-20 mt-20"></div>

                            {/* Stats numbers */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-lemon-green">
                                    Activity
                                </h2>

                                <div className="grid grid-cols-2 gap-10 pb-20">
                                    <div className="card bg-synth-purple/10">
                                        <p className="text-sm opacity-70 mb-2">Articles</p>
                                        <p className="text-3xl font-bold">0</p>
                                    </div>

                                    <div className="card bg-synth-purple/10">
                                        <p className="text-sm opacity-70 mb-2">Comments</p>
                                        <p className="text-3xl font-bold">{comments.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Comments */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-lemon-green">
                                    Recent Comments
                                </h2>

                                {loading ? (
                                    <p className="opacity-70">Loading comments...</p>
                                ) : comments.length === 0 ? (
                                    <p className="opacity-70">No comments yet</p>
                                ) : (
                                    <div className="space-y-10">
                                        {comments.slice(0, 5).map((comment) => (
                                            <div key={comment._id} className="card bg-violette">
                                                {editingComment === comment._id ? (
                                                    //Editing mode
                                                    <div className="space-y-3">
                                                        <textarea
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="input w-full min-h-[80px]"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleSaveEdit(comment._id)}
                                                                className="btn-sm btn-primary"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingComment(null)}
                                                                className="btn-sm btn-secondary"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Mode affichage
                                                    <>
                                                        <p className="opacity-90 mb-2">{comment.content}</p>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-sm opacity-50">
                                                                {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                                                            </p>
                                                            <div className="flex gap-4">
                                                                <button
                                                                    onClick={() => handleEditComment(comment._id, comment.content)}
                                                                    className="pr-10 text-lemon-green hover:underline text-sm font-semibold"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment._id)}
                                                                    className="text-red-500 hover:underline text-sm font-semibold"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

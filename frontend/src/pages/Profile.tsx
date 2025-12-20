import { useAuth } from '@/context/AuthContext';
import { useNavigate, } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { commentService } from '@/services/commentService';
import type { Comment } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// import toast from 'react-hot-toast';

export function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserComments = async () => {
            if (!user) return;

            try {
                // get all comments
                const allComments = await commentService.getAll();

                // filter from te connected user
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
                        className=" btn-sm text-lemon-green hover:underline flex items-center gap-2"
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
                                <h2 className="text-2xl font-bold mb-6 text-lemon-green">
                                    Account Information
                                </h2>

                                <div className="space-y-5 pb-20">
                                    <div>
                                        <label className="text-sm opacity-70">Username</label>
                                        <p className="text-lg font-semibold">{user.username}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm opacity-70">Email</label>
                                        <p className="text-lg">{user.email}</p>
                                    </div>

                                    <div className='pb-10'>
                                        <label className="text-sm opacity-70 ">Role</label>
                                        <p className="text-lg">
                                            <span className={`badge ${user.role === 'admin' ? 'badge-vca' : 'badge-lfo'}`}>
                                                {user.role}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-synth-purple/30 pb-20"></div>

                            {/* Stats */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-lemon-green">
                                    Activity
                                </h2>

                                <div className="grid grid-cols-2 gap-10 pb-20">
                                    <div className="card bg-synth-purple/10">
                                        <p className="text-sm opacity-70 mb-2">Articles</p>
                                        <p className="text-3xl font-bold">0</p>
                                    </div>

                                    <div className="card bg-synth-purple/10 ">
                                        <p className="text-sm opacity-70 mb-2">Comments</p>
                                        <p className="text-3xl font-bold">{comments.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}

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
                                    <div className="space-y-10 ">
                                        {comments.slice(0, 5).map((comment) => (
                                            <div key={comment._id} className="card bg-violette">
                                                <p className="opacity-90 mb-2">{comment.content}</p>
                                                <p className="text-sm opacity-50">
                                                    {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
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

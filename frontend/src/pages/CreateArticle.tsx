import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { articleService } from '@/services/articleService';
import { ArticleForm } from '@/components/article/ArticleForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

export function CreateArticle() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (data: { title: string; content: string; category: Category, published: boolean; }) => {
        if (!user) {
            toast.error('You must be logged in');
            return;
        }

        setLoading(true);

        try {
            const newArticle = await articleService.create(data);
            toast.success('Article created!');
            navigate(`/articles/${newArticle._id}`);
        } catch (error) {
            console.error('Error creating article:', error);
            toast.error('Failed to create article');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <>
                <Header />
                <div className="text-center py-20">
                    <p className="text-red-500 mb-4">You must be logged in to create an article</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary">
                        Go to Login
                    </button>
                </div>
                <Footer />
            </>
        );
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

                {/* Page Header */}
                <div className="col-span-6 md:col-span-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="font-large font-bold mb-6 glow-lime uppercase">
                            Create Article
                        </h1>
                        <p className="opacity-70 mb-8">
                            Share your knowledge about synthesizers
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="col-span-6 md:col-span-12">
                    <div className="max-w-4xl mx-auto">
                        <ArticleForm
                            onSubmit={handleCreate}
                            submitLabel="Create Article"
                            loading={loading}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

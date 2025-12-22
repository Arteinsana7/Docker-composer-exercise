import { useState } from 'react';
import type { Category } from '@/types';

interface ArticleFormProps {
    onSubmit: (data: {
        title: string;
        content: string;
        category: Category;
        published: boolean;  // boolean to show if the article is publish or not
    }) => Promise<void>;
    initialData?: {
        title: string;
        content: string;
        category: Category;
        published: boolean;  // boolean to show if the article is publish or not
    };
    submitLabel?: string;
    loading?: boolean;
}

export const ArticleForm = ({
    onSubmit,
    initialData = {
        title: '',
        content: '',
        category: 'oscillator',
        published: false // boolean to show if the article is publish or not
    },
    submitLabel = 'Submit',
    loading = false
}: ArticleFormProps) => {
    const [formData, setFormData] = useState(initialData);

    const categories: Category[] = [
        'oscillator',
        'envelope',
        'lfo',
        'filter',
        'vca',
        'sequencer',
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('📤 FormData being sent:', formData);
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="card space-y-8">

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-2 opacity-70">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input w-full"
                    placeholder="e.g., Understanding ADSR Envelopes"
                    required
                    disabled={loading}
                />
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-semibold mb-2 opacity-70">
                    Category
                </label>
                <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="input w-full"
                    disabled={loading}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Content */}
            <div>
                <label htmlFor="content" className="block text-sm font-semibold mb-2 opacity-70">
                    Content
                </label>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="input w-full min-h-[300px]"
                    placeholder="Write your article content here..."
                    required
                    disabled={loading}
                />
            </div>

            {/* Published Toggle */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-semibold opacity-70">
                    Status:
                </label>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, published: !formData.published })}
                    className={`badge ${formData.published ? 'badge-lfo' : 'badge-vca'} cursor-pointer`}
                    disabled={loading}
                >
                    {formData.published ? 'Published' : 'Draft'}
                </button>
                <span className="text-sm opacity-50 pr-20">
                    {formData.published
                        ? 'Visible to everyone'
                        : 'Only visible to you'}
                </span>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-20 ">
                <button
                    type="submit"
                    className="btn-sm"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : submitLabel}
                </button>
            </div>
        </form>
    );
};

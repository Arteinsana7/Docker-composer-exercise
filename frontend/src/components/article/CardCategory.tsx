import type { Category } from "@/types";
import { Link } from "react-router-dom"

interface CardCategoryProps {
    category: Category;
    icon?: string;
    image: string
    title: string;
    description: string;
}

export const CardCategory = ({ category, icon, image, title, description }: CardCategoryProps) => {
    const getBadgeClass = (cat: string) => {
        const badges: Record<string, string> = {
            'oscillator': 'badge-oscillator',
            'envelope': 'badge-envelope',
            'lfo': 'badge-lfo',
            'filter': 'badge-filter',
            'vca': 'badge-vca',
            'sequencer': 'badge-sequencer',
        };
        return badges[cat] || 'badge-default';
    };

    return (
        <div className="col-span-full md:col-span-4">
            <div className="main-container">
                <div className="">

                    <Link to={`/categories/${category}`}>
                        <div className="card min-h-[300px]  flex flex-col justify-between">

                            {/* Badge + icon  */}
                            <div className="flex items-left ">
                                {icon && <span className="text-3xl">{icon}</span>}
                                <span className={`badge ${getBadgeClass(category)}`}>
                                    {category}
                                </span>
                            </div>
                            {/* Title */}
                            <h3 className="text-2xl font-bold mb-3">
                                {title}
                            </h3>
                            <div className="w-full h-48 mb-4 rounded-lg">
                                {/* image */}
                                <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Description */}
                            <p className="opacity-80">
                                {description}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default CardCategory;


import { Headphones, Gamepad2, Camera, Wifi, Watch, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/card';

const categories = [
    { name: 'Audio', icon: Headphones, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Gaming', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Cameras', icon: Camera, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'Smart Home', icon: Wifi, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Wearables', icon: Watch, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Electronics', icon: Cpu, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

interface FeaturedCategoriesProps {
    onCategorySelect?: (category: string) => void;
}

export function FeaturedCategories({ onCategorySelect }: FeaturedCategoriesProps) {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                    <Card
                        key={cat.name}
                        className={`p-4 hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-primary/50 group bg-card/50 backdrop-blur-sm`}
                        onClick={() => onCategorySelect?.(cat.name)}
                    >
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className={`p-3 rounded-full ${cat.bg} group-hover:scale-110 transition-transform duration-300`}>
                                <cat.icon className={`w-6 h-6 ${cat.color}`} />
                            </div>
                            <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                {cat.name}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

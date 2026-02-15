import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CategoryFilterProps {
    categories: string[];
    selectedCategories: string[];
    onChange: (category: string) => void;
}

export function CategoryFilter({
    categories,
    selectedCategories,
    onChange,
}: CategoryFilterProps) {
    return (
        <div className="space-y-4">
            <Label className="text-base font-medium">Categories</Label>
            <div className="space-y-3">
                {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => onChange(category)}
                        />
                        <Label
                            htmlFor={`category-${category}`}
                            className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                        >
                            {category}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}

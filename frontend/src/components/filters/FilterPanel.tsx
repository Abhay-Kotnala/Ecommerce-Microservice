import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeSlider } from './PriceRangeSlider';

export interface FilterState {
    priceRange: [number, number];
    categories: string[];
    sortBy: string;
}

interface FilterPanelProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    categories: string[];
    minPrice: number;
    maxPrice: number;
    className?: string;
}

export function FilterPanel({
    filters,
    setFilters,
    categories,
    minPrice,
    maxPrice,
    className,
}: FilterPanelProps) {
    const updatePriceRange = (range: [number, number]) => {
        setFilters({ ...filters, priceRange: range });
    };

    const toggleCategory = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter((c) => c !== category)
            : [...filters.categories, category];
        setFilters({ ...filters, categories: newCategories });
    };

    const updateSort = (value: string) => {
        setFilters({ ...filters, sortBy: value });
    };

    const clearFilters = () => {
        setFilters({
            priceRange: [minPrice, maxPrice],
            categories: [],
            sortBy: 'newest',
        });
    };

    const activeFilterCount =
        (filters.categories.length > 0 ? 1 : 0) +
        (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice ? 1 : 0) +
        (filters.sortBy !== 'newest' ? 1 : 0);

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Header with Clear Button */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
                    >
                        Clear All
                        <X className="ml-1 h-3 w-3" />
                    </Button>
                )}
            </div>

            <Separator />

            {/* Sort By */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={filters.sortBy} onValueChange={updateSort}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A-Z</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            {/* Price Range */}
            <PriceRangeSlider
                min={minPrice}
                max={maxPrice}
                value={filters.priceRange}
                onChange={updatePriceRange}
            />

            <Separator />

            {/* Categories */}
            <CategoryFilter
                categories={categories}
                selectedCategories={filters.categories}
                onChange={toggleCategory}
            />
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={`hidden lg:block space-y-6 ${className}`}>
                <div className="sticky top-24 p-6 rounded-xl border border-white/10 bg-card/30 backdrop-blur-md">
                    <FilterContent />
                </div>
            </div>

            {/* Mobile Drawer */}
            <div className="lg:hidden mb-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full gap-2">
                            <Filter className="h-4 w-4" />
                            Filters & Sort
                            {activeFilterCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle>Filters & Sort</SheetTitle>
                        </SheetHeader>
                        <FilterContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

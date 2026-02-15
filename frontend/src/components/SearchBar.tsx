import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    className?: string;
}

export function SearchBar({ className = '' }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to products page with search query
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <form onSubmit={handleSearch} className={`relative ${className}`}>
            <div className={`
        relative flex items-center
        transition-all duration-200
        ${isFocused ? 'scale-105' : 'scale-100'}
      `}>
                {/* Search Icon */}
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />

                {/* Search Input */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search products..."
                    className={`
            w-full pl-10 pr-10 py-2 
            bg-secondary/30 
            border border-white/10
            rounded-full
            text-sm
            placeholder:text-muted-foreground/60
            focus:outline-none 
            focus:ring-2 
            focus:ring-primary/50
            focus:border-primary/50
            focus:bg-secondary/50
            transition-all
            hover:bg-secondary/40
          `}
                />

                {/* Clear Button */}
                {searchQuery && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </form>
    );
}

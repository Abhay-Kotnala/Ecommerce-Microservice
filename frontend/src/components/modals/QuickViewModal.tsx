import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Check, AlertCircle, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import type { Product } from '@/types';

interface QuickViewModalProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
    const { addItem, getItemQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const cartQuantity = getItemQuantity(product.id);
    const maxQuantity = product.stockQuantity - cartQuantity;
    const isOutOfStock = product.stockQuantity === 0;

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= maxQuantity) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (quantity > maxQuantity) return;

        addItem(product, quantity);
        toast({
            title: 'Added to cart',
            description: `${quantity}x ${product.name} added to your cart.`,
        });
        setQuantity(1);
        onOpenChange(false);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden sm:rounded-2xl gap-0">
                <div className="grid md:grid-cols-2">
                    {/* Left: Image */}
                    <div className="bg-secondary/20 p-6 flex items-center justify-center relative aspect-square md:aspect-auto">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                            />
                        ) : (
                            <Package className="h-32 w-32 text-muted-foreground/40" />
                        )}

                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                <div className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold">
                                    Out of Stock
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="p-6 md:p-8 flex flex-col h-full">
                        <div className="mb-auto">
                            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-bold text-primary">
                                    {formatPrice(product.price)}
                                </span>
                                {!isOutOfStock && product.stockQuantity <= 5 && (
                                    <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded">
                                        Low Stock: {product.stockQuantity} Left
                                    </span>
                                )}
                            </div>

                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                {product.description || 'No description available for this product.'}
                            </p>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-6 text-sm">
                                {isOutOfStock ? (
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="font-medium">Out of Stock</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-success">
                                        <Check className="h-4 w-4" />
                                        <span className="font-medium">In Stock</span>
                                        <span className="text-muted-foreground">({product.stockQuantity} available)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {!isOutOfStock && (
                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-border rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="rounded-r-none h-10 w-10"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= maxQuantity}
                                            className="rounded-l-none h-10 w-10"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <Button
                                        className="flex-1 h-10"
                                        onClick={handleAddToCart}
                                        disabled={maxQuantity <= 0}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                </div>
                                {cartQuantity > 0 && (
                                    <p className="text-xs text-center text-primary">
                                        You already have {cartQuantity} in your cart
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

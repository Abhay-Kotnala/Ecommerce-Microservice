import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';

interface PriceRangeSliderProps {
    min: number;
    max: number;
    step?: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({
    min,
    max,
    step = 100,
    value,
    onChange,
}: PriceRangeSliderProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Price Range</Label>
                <span className="text-sm text-muted-foreground">
                    {formatPrice(value[0])} - {formatPrice(value[1])}
                </span>
            </div>
            <Slider
                min={min}
                max={max}
                step={step}
                value={value}
                onValueChange={(val) => onChange(val as [number, number])}
                className="py-4"
            />
        </div>
    );
}

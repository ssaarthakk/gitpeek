'use client';
import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import axios from '@/lib/api';

export default function BuyCreditsButton() {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyCredits = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/checkout', { quantity });

      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        console.error("Stripe checkout URL not found.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white">Buy More Credits</h3>
      <p className="text-sm text-white/50 mt-1">Purchase credits to share more repositories.</p>
      <div className="flex items-center gap-4 mt-6">
        <div className="w-32">
          <Input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max="100"
            value={String(quantity)}
            onChange={(e) => setQuantity(Number(e.target.value))}
            aria-label="Quantity"
          />
        </div>
        <Button onPress={handleBuyCredits} isDisabled={isLoading} className="relative w-48">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
            {`Buy ${quantity} Credit${quantity === 1 ? '' : 's'}`}
          </span>
        </Button>
      </div>
    </div>
  );
}
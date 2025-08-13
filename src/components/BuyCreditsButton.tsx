'use client';

import { useState } from 'react';

export default function BuyCreditsButton() {
  const [quantity, setQuantity] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyCredits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const { url } = await response.json();
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
    <div>
      <h3>Buy More Credits</h3>
      <label htmlFor="quantity">Quantity:</label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        min="1"
        max="100"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ marginLeft: '10px', marginRight: '10px' }}
      />
      <button onClick={handleBuyCredits} disabled={isLoading}>
        {isLoading ? 'Processing...' : `Buy ${quantity} Credits`}
      </button>
    </div>
  );
}
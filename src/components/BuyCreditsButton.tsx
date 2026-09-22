'use client';
import { useState } from 'react';
import axios from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { Button, cx, inputClass } from '@/components/kit';

// Prices mirror the checkout route: $1 per credit (STRIPE_PRICE_ID), with the bulk coupon
// (STRIPE_DISCOUNT_COUPON_ID, 10% off) applied from 10 credits up. Stripe shows the final amount.
const UNIT_PRICE = 1;
const BULK_MIN = 10;
const BULK_DISCOUNT = 0.1;
const MAX_QUANTITY = 100;

const packs = [
  { quantity: 5, name: '5 credits' },
  { quantity: 20, name: '20 credits' },
  { quantity: 100, name: '100 credits' },
];

function priceFor(quantity: number) {
  const each = quantity >= BULK_MIN ? UNIT_PRICE * (1 - BULK_DISCOUNT) : UNIT_PRICE;
  return { each, total: each * quantity };
}

const money = (n: number) => `$${n.toFixed(2)}`;

/** "Add credits" body: pick a pack tile (or any amount up to 100) and hand off to Stripe Checkout. */
export default function BuyCreditsButton() {
  const toast = useToast();
  const [quantity, setQuantity] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const valid = Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY;
  const { total } = priceFor(valid ? quantity : 0);

  const handleBuyCredits = async () => {
    if (!valid) return;
    setIsLoading(true);
    try {
      const response = await axios.post('/api/checkout', { quantity });
      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        console.error('Stripe checkout URL not found.');
        toast.error('Failed to create checkout session');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      toast.error('Failed to create checkout session');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {packs.map((p) => {
          const on = quantity === p.quantity;
          const { each, total: packTotal } = priceFor(p.quantity);
          return (
            <button
              key={p.quantity}
              type="button"
              aria-pressed={on}
              onClick={() => setQuantity(p.quantity)}
              className={cx(
                'flex flex-col gap-3 rounded-[18px] p-5 text-left transition-colors',
                on ? 'bg-accent text-white' : 'bg-surface-2 text-ink hover:bg-hover',
              )}
            >
              <span className={cx('text-[13px]', on ? 'text-white/85' : 'text-ink-3')}>{p.name}</span>
              <span className="text-[28px] font-semibold leading-none tabular-nums">{money(packTotal)}</span>
              <span className={cx('text-xs', on ? 'text-white/85' : 'text-ink-3')}>
                {money(each)} each · {p.quantity >= BULK_MIN ? `${BULK_DISCOUNT * 100}% bulk discount` : 'full price'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-[18px] bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-3 text-[13px] text-ink-3">
            Or any amount
            <span className="w-24">
            <input
              type="number"
              min={1}
              max={MAX_QUANTITY}
              value={Number.isNaN(quantity) ? '' : String(quantity)}
              onChange={(e) => setQuantity(Number(e.target.value))}
              aria-label="Number of credits"
              className={inputClass}
            />
            </span>
          </label>
          <div className="text-xs text-ink-4">
            {valid ? 'You will be handed to Stripe. GitPeek never sees your card.' : `Between 1 and ${MAX_QUANTITY} credits.`}
          </div>
        </div>
        <Button size="lg" onClick={handleBuyCredits} disabled={isLoading || !valid}>
          {isLoading
            ? 'Opening Stripe…'
            : valid
              ? `Buy ${quantity} credit${quantity === 1 ? '' : 's'} · ${money(total)}`
              : 'Buy credits'}
        </Button>
      </div>
    </div>
  );
}

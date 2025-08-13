// app/dashboard/billing/page.tsx
import BuyCreditsButton from "@/components/BuyCreditsButton";
import DisplayCredits from "@/components/DisplayCredits";

export default function BillingPage() {
  return (
    <div>
      <h1>Billing</h1>
      <p>Manage your credits and subscription.</p>
      <DisplayCredits />
      <BuyCreditsButton />
    </div>
  );
}
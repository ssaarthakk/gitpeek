import { auth } from "@/auth";
import BuyCreditsButton from "@/components/BuyCreditsButton";
import DisplayCredits from "@/components/DisplayCredits";
import { useSession } from "next-auth/react";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) {
    return <p>You're not logged in, Please Login.</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Billing</h1>
        <p className="text-white/60">Manage your credits and view your billing history.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <DisplayCredits />
        </div>
        <div className="md:col-span-2">
          <BuyCreditsButton />
        </div>
      </div>
    </div>
  );
}
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BillingContent from "@/components/dashboard/BillingContent";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  // Stripe Checkout returns here with ?success=true or ?canceled=true (see /api/checkout).
  const params = await searchParams;
  const checkoutResult = params.success === 'true' ? 'success' : params.canceled === 'true' ? 'canceled' : null;

  return <BillingContent session={session} checkoutResult={checkoutResult} />;
}

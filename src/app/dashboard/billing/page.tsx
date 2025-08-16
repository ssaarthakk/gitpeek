import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BillingContent from "@/components/dashboard/BillingContent";

export default async function BillingPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/');
  }

  return <BillingContent session={session} />;
}
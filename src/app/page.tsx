import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesNew from "@/components/landing/FeaturesNew";
import Footer from "@/components/Footer";
import { SignInLoadingProvider } from "@/components/landing/SignInLoadingContext";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <SignInLoadingProvider>
      <main className="min-h-screen w-full bg-[#0b0f14] text-[#e6edf3]">
        <Header />

        {/* Hero */}
        <section className="py-12 md:py-16 scroll-mt-24">
          <Hero />
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-12 md:py-16 scroll-mt-24">
          <HowItWorks />
        </section>

        {/* Features */}
        <section id="features" className="py-12 md:py-16 scroll-mt-24">
          <FeaturesNew />
        </section>

        <Footer />
      </main>
    </SignInLoadingProvider>
  );
}
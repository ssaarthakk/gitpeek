import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/landing/Pricing";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitPeek - Pricing',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen w-full bg-[#0b0f14] text-[#e6edf3]">
      <Header />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Pricing</h1>
          <p className="text-white/70 mb-10">Choose the plan that fits. Start free and upgrade when you need more credits.</p>
        </div>
        <Pricing />
      </section>
      <Footer />
    </main>
  );
}

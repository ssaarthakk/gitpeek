import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
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
        <Features />
      </section>

      <Footer />
    </main>
  );
}
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0b0f14] text-[#e6edf3]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-white/70 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4 leading-7 text-white/80">
          <p>
            Your privacy is important to us. This policy explains what information we collect, how we use it, and your choices.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">1. Information We Collect</h2>
          <p>
            We collect account information (e.g., email, name) via authentication providers, and usage data related to repository processing for providing the service.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">2. How We Use Information</h2>
          <p>
            We use your information to operate, maintain, and improve Git Peek, to provide customer support, and to communicate important service updates.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share limited data with service providers (e.g., payments, analytics) under strict confidentiality obligations.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">4. Security</h2>
          <p>
            We implement reasonable security measures to protect your information; however, no method of transmission over the Internet is completely secure.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">5. Your Choices</h2>
          <p>
            You can access and update your account data via the app. If you have questions or requests, contact us on Twitter at <a className="text-indigo-400 hover:text-indigo-300" href="https://x.com/ssaarthakk" target="_blank" rel="noopener noreferrer">@ssaarthakk</a>.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">6. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Significant changes will be posted in the app.
          </p>
        </section>
      </div>
    </main>
  );
}

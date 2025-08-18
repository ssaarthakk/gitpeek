export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0b0f14] text-[#e6edf3]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-white/70 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4 leading-7 text-white/80">
          <p>
            Welcome to Git Peek. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">1. Use of Service</h2>
          <p>
            You agree to use Git Peek in compliance with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">2. Accounts and Billing</h2>
          <p>
            Certain features may require a paid subscription. By subscribing, you authorize us to charge the applicable fees. Fees are non-refundable except as required by law.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">3. Content and Intellectual Property</h2>
          <p>
            You retain ownership of your content. By using Git Peek to process repository data, you grant us a limited license to process that content solely to provide the service.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">4. Prohibited Activities</h2>
          <p>
            You may not misuse the service, including attempting unauthorized access, interfering with its operation, or violating third-party rights.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">5. Disclaimers</h2>
          <p>
            Git Peek is provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind. We do not guarantee uninterrupted or error-free operation.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Git Peek and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">7. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the service after changes becomes effective constitutes your acceptance of the new Terms.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6">8. Contact</h2>
          <p>
            Questions about these Terms? Reach out to us on Twitter at <a className="text-indigo-400 hover:text-indigo-300" href="https://x.com/ssaarthakk" target="_blank" rel="noopener noreferrer">@ssaarthakk</a>.
          </p>
        </section>
      </div>
    </main>
  );
}

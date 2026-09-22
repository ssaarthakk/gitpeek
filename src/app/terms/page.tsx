import type { Metadata } from 'next';
import LegalDoc, { type LegalSection } from '@/components/landing/LegalDoc';

export const metadata: Metadata = {
  title: 'Terms — GitPeek',
  description: 'The terms that apply when you use GitPeek.',
};

const sections: LegalSection[] = [
  {
    id: 'use-of-service',
    title: 'Use of service',
    body: (
      <p>
        You agree to use Git Peek in compliance with all applicable laws and regulations. You are responsible for
        maintaining the confidentiality of your account and for all activities that occur under your account.
      </p>
    ),
  },
  {
    id: 'accounts-and-billing',
    title: 'Accounts and billing',
    body: (
      <p>
        Certain features may require a paid subscription. By subscribing, you authorize us to charge the applicable fees.
        Fees are non-refundable except as required by law.
      </p>
    ),
  },
  {
    id: 'content',
    title: 'Content and intellectual property',
    body: (
      <p>
        You retain ownership of your content. By using Git Peek to process repository data, you grant us a limited
        license to process that content solely to provide the service.
      </p>
    ),
  },
  {
    id: 'prohibited-activities',
    title: 'Prohibited activities',
    body: (
      <p>
        You may not misuse the service, including attempting unauthorized access, interfering with its operation, or
        violating third-party rights.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: (
      <p>
        Git Peek is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any
        kind. We do not guarantee uninterrupted or error-free operation.
      </p>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of liability',
    body: (
      <p>
        To the maximum extent permitted by law, Git Peek and its affiliates shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to terms',
    body: (
      <p>
        We may update these Terms from time to time. Continued use of the service after changes becomes effective
        constitutes your acceptance of the new Terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Questions about these Terms? Reach out to us on Twitter at{' '}
        <a className="text-accent hover:underline" href="https://x.com/ssaarthakk" target="_blank" rel="noopener noreferrer">
          @ssaarthakk
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      doc="terms"
      title="Terms of Service"
      updated="[DATE]"
      intro={
        <p>
          Welcome to Git Peek. By accessing or using our website and services, you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use our services.
        </p>
      }
      sections={sections}
    />
  );
}

import type { Metadata } from 'next';
import LegalDoc, { type LegalSection } from '@/components/landing/LegalDoc';

export const metadata: Metadata = {
  title: 'Privacy — GitPeek',
  description: 'What information GitPeek collects, how it is used, and your choices.',
};

const contactLink = (
  <a className="text-accent hover:underline" href="https://x.com/ssaarthakk" target="_blank" rel="noopener noreferrer">
    @ssaarthakk
  </a>
);

const sections: LegalSection[] = [
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    body: (
      <p>
        We collect account information (e.g., email, name) via authentication providers, and usage data related to
        repository processing for providing the service.
      </p>
    ),
  },
  {
    id: 'how-we-use-information',
    title: 'How we use information',
    body: (
      <p>
        We use your information to operate, maintain, and improve Git Peek, to provide customer support, and to
        communicate important service updates.
      </p>
    ),
  },
  {
    id: 'data-sharing',
    title: 'Data sharing',
    body: (
      <p>
        We do not sell your personal information. We may share limited data with service providers (e.g., payments,
        analytics) under strict confidentiality obligations.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        We implement reasonable security measures to protect your information; however, no method of transmission over
        the Internet is completely secure.
      </p>
    ),
  },
  {
    id: 'your-choices',
    title: 'Your choices',
    body: (
      <p>
        You can access and update your account data via the app. If you have questions or requests, contact us on
        Twitter at {contactLink}.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>We may update this Privacy Policy from time to time. Significant changes will be posted in the app.</p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      doc="privacy"
      title="Privacy Policy"
      updated="[DATE]"
      intro={
        <p>
          Your privacy is important to us. This policy explains what information we collect, how we use it, and your
          choices.
        </p>
      }
      sections={sections}
    />
  );
}

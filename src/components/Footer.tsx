import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
        <p className="order-2 md:order-1">© {new Date().getFullYear()} Git Peek. All rights reserved.</p>
        <nav className="order-1 md:order-2 flex items-center gap-6">
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="https://x.com/ssaarthakk" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</Link>
        </nav>
      </div>
    </footer>
  );
}

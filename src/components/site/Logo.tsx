import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-ink hover:no-underline">
      <Image src="/GitPeek.png" alt="" width={22} height={22} className="h-[22px] w-[22px]" priority />
      <span className="text-base font-semibold">GitPeek</span>
    </Link>
  );
}

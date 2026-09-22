type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Page-width wrapper used by every marketing page: 1200px max, 16px gutter on phones. */
export default function Container({ children, className = '' }: Props) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 ${className}`}>{children}</div>;
}

/**
 * A landing-page section: an optional heading row (title on the left, intro on the right
 * on wide screens) followed by its tile grid. No bands or hairlines; sections sit on the canvas.
 */
export function Section({
  children,
  id,
  title,
  intro,
  className = '',
}: Props & { id?: string; title?: React.ReactNode; intro?: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-24 pt-16 sm:pt-20 ${className}`}>
      <Container>
        {(title || intro) && (
          <div className="mb-5 grid grid-cols-1 items-end gap-3 px-1 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] md:gap-10">
            {title && <h2 className="text-[26px] leading-[1.2] font-semibold text-ink sm:text-[32px]">{title}</h2>}
            {intro && <p className="text-[15px] leading-[1.65] text-ink-3">{intro}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

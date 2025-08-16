'use client';

export const CustomUnderline = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={`absolute -bottom-2 left-0 w-full h-3 ${className}`}
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 8c15-3 25-1 35-2 12-1 20-2 30-1 8 1 15 2 20 1 3-1 6-2 8-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-blue-500"
      />
      <path
        d="M1 6c20-2 30-1 40-1 15 0 25-1 35 0 7 1 12 2 18 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-blue-400 opacity-60"
      />
    </svg>
  );
};

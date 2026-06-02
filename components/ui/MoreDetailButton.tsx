import type { ReactNode } from "react";

type MoreDetailButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function MoreDetailButton({
  children,
  disabled = false,
  onClick,
}: MoreDetailButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex flex-col items-start gap-1 text-base-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="flex items-center gap-2.5">
        <span className="font-body text-cta-button">{children}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="size-5 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.1665 10H15.8332"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M10.8335 5L15.8335 10L10.8335 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span aria-hidden="true" className="block h-px w-full bg-current" />
    </button>
  );
}

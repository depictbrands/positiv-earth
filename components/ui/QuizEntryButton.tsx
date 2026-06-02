import type { ReactNode } from "react";

type QuizEntryButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function QuizEntryButton({
  children,
  disabled = false,
  onClick,
}: QuizEntryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/12 px-6 py-3 text-center font-body text-cta-button text-base-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_10px_30px_rgba(24,24,24,0.12)] backdrop-blur-md transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

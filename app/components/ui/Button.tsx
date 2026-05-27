import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-xl font-semibold transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "!bg-[#C9A227] !text-white shadow-md",
  secondary: "!bg-white !text-[#C9A227] border border-[#C9A227]",
};

const sizeClasses = {
  sm: "h-[40px] w-[160px] text-sm",
  md: "h-[50px] w-[200px] text-base",
  lg: "h-[56px] w-[240px] text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  );
}
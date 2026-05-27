import { ReactNode } from "react";

type CardProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="w-[300px] h-[280px] bg-[#E8E7E5] rounded-3xl p-6 border border-neutral-200 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>

      <p className="mt-2 text-gray-600">
        {description}
      </p>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}
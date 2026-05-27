"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Meu Currículo", href: "/dashboard", icon: "📄" },
  { label: "Minhas Vagas", href: "/dashboard/jobs", icon: "💼" },
  { label: "Criar Nova Vaga", href: "/dashboard/create-job", icon: "➕" },
  { label: "Perfil", href: "/dashboard/profile", icon: "👤" },
  { label: "Configurações", href: "/dashboard/settings", icon: "⚙️" },
  { label: "Sair", href: "/", icon: "↪️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[80px] z-40 h-[calc(100vh-80px)] w-[320px] overflow-y-auto bg-[#F1F1EF] shadow-sm">
      <div className="grid grid-cols-1 gap-3 px-5 pt-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group
                grid
                h-[64px]
                grid-cols-[55px_1fr]
                items-center
                rounded-2xl
                px-5
                transition-all
                duration-300
                ease-in-out
                hover:h-[74px]
                hover:scale-[1.02]
                ${
                  isActive
                    ? "bg-[#C9A227] text-white shadow-lg"
                    : "text-[#181A1B] hover:bg-[#C9A227] hover:text-white hover:shadow-xl"
                }
              `}
            >
              <span className="text-center text-3xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>

              <span className="text-[18px] font-bold transition-all duration-300">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
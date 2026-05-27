"use client";

import Link from "next/link";

type HeaderProps = {
  userName?: string;
};

export default function Header({ userName = "Tiago" }: HeaderProps) {
  return (
    <header className="fixed left-0 top-0 z-50 h-[80px] w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="grid h-full grid-cols-12 items-center px-8">
        
        {/* COLUNA 1-3 - LOGO */}
        <div className="col-span-2 flex items-center justify-center">
          <h1 className="whitespace-nowrap text-[28px] font-medium text-[#8A6A00]">
            Vagas Nordestinas
          </h1>
        </div>

        {/* COLUNA 4-9 - NAVEGAÇÃO CENTRAL */}
        <nav className="col-span-7 flex items-center justify-center gap-8">
          <Link
            href="/vagas"
            className="whitespace-nowrap text-[18px] font-semibold text-gray-700 transition hover:text-[#C9A227]"
          >
            Vagas
          </Link>

          <Link
            href="/avaliacoes"
            className="whitespace-nowrap text-[18px] font-semibold text-gray-700 transition hover:text-[#C9A227]"
          >
            Avaliações da Empresa
          </Link>

          <Link
            href="/cargos"
            className="whitespace-nowrap text-[18px] font-semibold text-gray-700 transition hover:text-[#C9A227]"
          >
            Cargos e Salários
          </Link>
        </nav>

        {/* COLUNA 10-12 - PERFIL */}
        <div className="col-span-2 flex items-center justify-end gap-4">
          <button className="text-[18px] font-semibold text-gray-700 transition hover:text-[#C9A227]">
            Buscar
          </button>

          <div className="h-12 w-12 rounded-full bg-gray-300" />

          <span className="text-[18px] font-semibold text-gray-800">
            {userName}
          </span>
        </div>

        <div className="col-span-1 flex"></div>
      </div>
    </header>
  );
}
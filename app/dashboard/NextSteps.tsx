export function NextSteps() {
  return (
    <section className="flex h-[70px] w-full items-center justify-between rounded-2xl border border-yellow-300 bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-[18px] font-bold text-yellow-600">
          Próximos passos recomendados
        </h2>

        <p className="text-[14px] text-gray-500">
          Vamos deixar seu currículo ainda mais competitivo!
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="flex h-[44px] w-[230px] items-center justify-center gap-3 rounded-xl border border-yellow-500 text-[15px] font-semibold text-yellow-600">
          🔍
          Comparar com vaga
        </button>

        <button className="flex h-[44px] w-[230px] items-center justify-center gap-3 rounded-xl bg-yellow-500 text-[15px] font-semibold text-white">
          🪄
          Otimizar currículo
        </button>
      </div>
    </section>
  );
}
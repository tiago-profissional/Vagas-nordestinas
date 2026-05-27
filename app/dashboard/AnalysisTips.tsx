export function AnalysisTips() {
  return (
    <section className="w-[500px] rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      
      {/* HEADER */}
      <div className="mb-4 flex items-center gap-3">
        
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm">
          ✨
        </div>

        <h2 className="text-[18px] font-bold text-gray-900">
          Análise da IA
        </h2>

      </div>

      {/* TITLE */}
      <h3 className="mb-4 text-[15px] font-semibold text-gray-800">
        Seu currículo está bem estruturado, mas pode melhorar:
      </h3>

      {/* LIST */}
      <div className="space-y-3">

        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[11px] text-white">
            ✓
          </span>

          <p className="text-[14px] text-gray-700">
            Destaque mais resultados com números e métricas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[11px] text-white">
            !
          </span>

          <p className="text-[14px] text-gray-700">
            Adicione mais palavras-chave técnicas relevantes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[11px] text-white">
            !
          </span>

          <p className="text-[14px] text-gray-700">
            Organize melhor suas experiências e projetos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[11px] text-white">
            ✓
          </span>

          <p className="text-[14px] text-gray-700">
            Inclua uma seção de certificações e cursos
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between">
        
        <button className="text-[14px] font-semibold text-yellow-600">
          Ver dicas detalhadas
        </button>

        <span className="text-lg text-yellow-500">
          →
        </span>

      </div>

    </section>
  );
}
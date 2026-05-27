type ScoreCardProps = {
  score: number;
};

export function ScoreCard({ score }: ScoreCardProps) {
  return (
    <section className="w-[520px] rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      
      {/* HEADER */}
      <div className="mb-5 flex items-center gap-3">
        
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm">
          🎯
        </div>

        <h2 className="text-[18px] font-bold text-gray-900">
          Score do currículo
        </h2>

      </div>

      {/* CONTENT */}
      <div className="flex items-center gap-6">

        {/* CIRCLE */}
        <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full border-[10px] border-yellow-400">
          
          <div className="text-center">
            <h3 className="text-[42px] font-bold text-gray-900">
              {score}
            </h3>

            <p className="text-[20px] text-gray-500">
              /100
            </p>
          </div>

        </div>

        {/* TEXT */}
        <div className="max-w-[180px]">
          
          <h3 className="mb-2 text-[20px] font-bold text-gray-900">
            Bom trabalho! 🎉
          </h3>

          <p className="text-[15px] leading-relaxed text-gray-600">
            Seu currículo está acima da média, mas ainda tem espaço para melhorias significativas.
          </p>

          <button className="mt-4 text-[15px] font-semibold text-yellow-600">
            Entenda sua pontuação
          </button>

        </div>

      </div>

    </section>
  );
}
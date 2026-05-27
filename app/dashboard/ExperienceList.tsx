type Experience = {
  title: string;
  company: string;
  period: string;
};

type ExperienceListProps = {
  experiences: Experience[];
};

export function ExperienceList({ experiences }: ExperienceListProps) {
  return (
    <section className="w-[420px] rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-lg">
          💼
        </div>

        <h2 className="text-[18px] font-bold text-gray-900">
          Experiência detectada
        </h2>
      </div>

      <div className="relative space-y-4">
        <div className="absolute left-[7px] top-2 h-[120px] w-px bg-yellow-200" />

        {experiences.map((experience, index) => (
          <div key={experience.title} className="relative flex gap-4">
            <span className="mt-2 h-3 w-3 rounded-full bg-yellow-500" />

            <div className="flex-1 border-b border-gray-200 pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900">
                    {experience.title}
                  </h3>

                  <p className="text-[13px] text-gray-500">
                    {experience.company}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-gray-500">
                    {experience.period}
                  </span>

                  {index === 0 && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-[12px] font-semibold text-green-700">
                      Atual
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button className="text-[15px] font-semibold text-yellow-600">
          Ver todas as experiências ({experiences.length})
        </button>

        <span className="text-xl text-yellow-500">→</span>
      </div>
    </section>
  );
}
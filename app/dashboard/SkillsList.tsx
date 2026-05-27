// src/components/dashboard/SkillsList.tsx

type SkillsListProps = {
  skills: string[];
  totalSkills: number;
};

export function SkillsList({
  skills,
  totalSkills,
}: SkillsListProps) {
  return (
    <section className="w-[420px] rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      
      {/* HEADER */}
      <div className="mb-5 flex items-center gap-3">
        
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-lg">
          {"</>"}
        </div>

        <h2 className="text-[18px] font-bold text-gray-900">
          Skills detectadas
        </h2>

      </div>

      {/* SKILLS */}
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="
              rounded-full
              bg-yellow-50
              px-4
              py-2
              text-[14px]
              font-semibold
              text-yellow-700
            "
          >
            {skill}
          </span>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-8 flex items-center justify-between">
        
        <button className="text-[15px] font-semibold text-yellow-600">
          Ver todas as skills ({totalSkills})
        </button>

        <span className="text-xl text-yellow-500">
          →
        </span>

      </div>

    </section>
  );
}
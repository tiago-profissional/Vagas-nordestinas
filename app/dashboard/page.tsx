import { DashboardLayout } from "../components/layout/DashboardLayout";

import ActionButtons from "./ActionButtons";
import { UploadZone } from "./UploadZone";
import { ResumeStatus } from "./ResumeStatus";
import { ExtractedInfo } from "./ExtractedInfo";
import { SkillsList } from "./SkillsList";
import { ExperienceList } from "./ExperienceList";
import { ScoreCard } from "./ScoreCard";
import { AnalysisTips } from "./AnalysisTips";
import { NextSteps } from "./NextSteps";

export default function DashboardPage() {
  const mockExtractedData = {
    name: "João Silva",
    email: "joaosilva@email.com",
    phone: "(11) 99999-9999",
    location: "São Paulo, SP",
    totalExperience: "2 anos",
  };

  const mockSkills = [
    "WordPress",
    "Elementor",
    "HTML",
    "CSS",
    "JavaScript",
    "jQuery",
    "PHP",
    "MySQL",
    "SEO",
    "Git",
    "Figma",
    "Responsive Design",
  ];

  const mockExperiences = [
    {
      title: "Desenvolvedor Frontend",
      company: "Agência Web Solutions",
      period: "03/2023 – Atual",
    },
    {
      title: "WordPress Freelancer",
      company: "Autônomo",
      period: "01/2022 – 02/2023",
    },
    {
      title: "Estagiário Web Developer",
      company: "Tech Company",
      period: "06/2021 – 12/2021",
    },
  ];

  return (
    <DashboardLayout>
      <main className="flex w-full justify-center p-6">
        <div className="w-full max-w-[1180px]">
          <ActionButtons />

          <section className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-5">
              <UploadZone />
            </div>

            <div className="col-span-12 lg:col-span-7">
              <ResumeStatus />
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <ExtractedInfo data={mockExtractedData} />
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <SkillsList skills={mockSkills} totalSkills={15} />
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <ExperienceList experiences={mockExperiences} />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <AnalysisTips />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <ScoreCard score={72} />
            </div>

            <div className="col-span-12">
              <NextSteps />
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
import { TExperience } from "../../types/experience";
import { Experience } from "./Experience";
import "./experience.css";

type ExperienceSectionProps = {
  experiencesData: TExperience[];
};

export const ExperienceSection = ({
  experiencesData,
}: ExperienceSectionProps) => {
  return (
    <div>
      <h2>Experience</h2>
      <div className="experience-grid">
        {experiencesData.map((experienceData) => (
          <Experience {...experienceData} />
        ))}
      </div>
    </div>
  );
};

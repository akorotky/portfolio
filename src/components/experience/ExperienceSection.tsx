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
      <h2
        style={{
          color: "rgb(0, 140, 233)",
          backgroundColor: "black",
          width: "11%",
          margin: "0 auto 0.5em auto",
          borderRadius: "1em",
          padding: "0.3em",
        }}
      >
        Experience
      </h2>
      <div className="experience-grid">
        {experiencesData.map((experienceData, idx) => (
          <Experience key={idx} {...experienceData} />
        ))}
      </div>
    </div>
  );
};

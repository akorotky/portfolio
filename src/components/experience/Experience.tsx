import { TExperience } from "../../types/experience";
import "./experience.css"

export const Experience = (experienceData: TExperience) => {
  return (
    <div className="experience-grid-cell">
      <h3>{experienceData.position}</h3>
      <p>{experienceData.date}</p>
      <p>{experienceData.location}</p>
      <p>{experienceData.summary}</p>
      {experienceData.skills.map((skill) => (
        <div>{skill}</div>
      ))}
    </div>
  );
};

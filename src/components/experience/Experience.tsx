import { TExperience } from "../../types/experience";
import "./experience.css";

export const Experience = (experienceData: TExperience) => {
  return (
    <div className="experience-grid-cell">
      <h3>{experienceData.position}</h3>
      <div>
        {[
          experienceData.company,
          experienceData.location,
          experienceData.date,
        ].join(" • ")}
      </div>
      <p>{experienceData.summary}</p>
      <h3>Skills Developed</h3>
      {experienceData.skills.map((skill, idx) => (
        <span key={idx}>
          <span>{skill}</span>
          {idx !== experienceData.skills.length - 1 && <span> • </span>}
        </span>
      ))}
    </div>
  );
};

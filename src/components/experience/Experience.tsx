import { TExperience } from "../../types/experience";
import "./experience.css";

export const Experience = (experienceData: TExperience) => {
  return (
    <div className="experience-grid-cell">
      <h3 style={{ color: "#FFE000" }}>{experienceData.position}</h3>
      <div>
        {[
          experienceData.company,
          experienceData.location,
          experienceData.date,
        ].join(" • ")}
      </div>
      <br></br>
      <ul style={{ textAlign: "start", margin: "0 auto 0 auto" }}>
        {experienceData.summary.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
      <h3 style={{ color: "#FFE000" }}>Skills Developed</h3>
      {experienceData.skills.join(" • ")}
    </div>
  );
};

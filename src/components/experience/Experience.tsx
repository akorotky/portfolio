import { TExperience } from "../../types/experience";
import "./experience.css";

export const Experience = (experienceData: TExperience) => {
  return (
    <div className="experience-grid-cell">
      <h3 style={{ color: "#FFD100", margin:"0 auto 0.7em auto" }}>{experienceData.position}</h3>
      <div style={{color:"#1ae400", fontSize:"0.95em"}}>
        {[
          experienceData.company,
          experienceData.location,
          experienceData.date,
        ].join(" • ")}
      </div>
      <ul style={{ textAlign: "start", margin: "1.5em auto 1.5em auto" }}>
        {experienceData.summary.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto 0 auto",
          color: "rgb(0, 140, 233)",
        }}
      >
        <strong style={{ color: "orange", margin: "0 auto 1em auto" }}>Skills Developed</strong>
        <div style={{display:"flex"}}>  {experienceData.skills.join(" • ")}</div>
      
      </div>
    </div>
  );
};

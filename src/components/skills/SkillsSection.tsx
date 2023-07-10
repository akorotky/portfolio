import { TSkills } from "../../types/skills";
import "./skills.css";

export const SkillsSection = (skillsData: TSkills) => {
  const skills = {
    "Programming Languages": skillsData.programmingLanguages,
    "Frontend Development": skillsData.frontendDevelopment,
    "Backend Development": skillsData.backendDevelopment,
    Databases: skillsData.databases,
    "CI/CD Tools": skillsData.cicd,
    "Developer Tools": skillsData.developerTools,
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          color: "rgb(0, 140, 233)",
          backgroundColor: "#000000da",
          width: "7%",
          margin: "0 auto 0.5em auto",
          borderRadius: "1em",
          padding: "0.3em",
        }}
      >
        Skills
      </h2>

      <div className="skills-container">
        {Object.keys(skills).map((category, categoryIdx) => {
          const currentSkillSet = skills[category as keyof typeof skills];
          return (
            <div className="skills-content" key={categoryIdx}>
              <strong style={{ color: "#FFF000" }}>{category}</strong>
              <ul style={{ textAlign: "start" }}>
                {currentSkillSet.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

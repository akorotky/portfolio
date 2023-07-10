import { ProjectSection } from "../project/ProjectSection.tsx";
import { ExperienceSection } from "../experience/ExperienceSection.tsx";
import { AboutSection } from "../about/AboutSection.tsx";
import { ThreeJsCanvas } from "../three-js/ThreeJsCanvas.tsx";
import { SkillsSection } from "../skills/SkillsSection.tsx";
import aboutData from "../../../data/about.json";
import experiencesData from "../../../data/experience.json";
import projectsData from "../../../data/projects.json";
import skillsData from "../../../data/skills.json";
import { useState } from "react";
import "./portfolio.css";

export const Portfolio = () => {
  const [showPortfolio, setShowPortfolio] = useState(true);
  return (
    <div>
      <ThreeJsCanvas />
      <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1 }}>
        <button onClick={() => setShowPortfolio(!showPortfolio)}>
          Toggle Playground
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          textAlign: "center",
          zIndex: `${showPortfolio ? 0 : -1}`,
        }}
      >
        <div className="portfolio-grid">
          <AboutSection {...aboutData} />
          <SkillsSection {...skillsData} />
          <ExperienceSection experiencesData={experiencesData} />
          <ProjectSection projectsData={projectsData} />
        </div>
      </div>
    </div>
  );
};

import { ProjectSection } from "./project/ProjectSection.tsx";
import { ExperienceSection } from "./experience/ExperienceSection.tsx";
import { AboutSection } from "./about/AboutSection.tsx";
import aboutData from "../../data/about.json";
import experiencesData from "../../data/experience.json";
import projectsData from "../../data/projects.json";
import { ThreeJsCanvas } from "./three-js/ThreeJsCanvas.tsx";

export const Portfolio = () => {
  return (
    <div>
      <ThreeJsCanvas />
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "none",
          }}
        >
          <AboutSection {...aboutData} />
          <ExperienceSection experiencesData={experiencesData} />
          <ProjectSection projectsData={projectsData} />
        </div>
      </div>
    </div>
  );
};

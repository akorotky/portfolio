import { ProjectSection } from "./project/ProjectSection.tsx";
import { ExperienceSection } from "./experience/ExperienceSection.tsx";
import { AboutSection } from "./about/AboutSection.tsx";
import aboutData from "../../data/about.json";
import experiencesData from "../../data/experience.json";
import projectsData from "../../data/projects.json";

export const Portfolio = () => {
  return (
    <>
      <AboutSection {...aboutData} />
      <ExperienceSection experiencesData={experiencesData} />
      <ProjectSection projectsData={projectsData} />
    </>
  );
};

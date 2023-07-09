import { Project } from "./Project.tsx";
import { TProject } from "../../types/project.ts";
import "./project.css";

type ProjectSectionProps = {
  projectsData: TProject[];
};

export const ProjectSection = ({ projectsData }: ProjectSectionProps) => {
  return (
    <div>
      <h2>Projects</h2>
      <div className="project-grid">
        {projectsData.map((projectData, idx) => (
          <Project key={idx} {...projectData} />
        ))}
      </div>
    </div>
  );
};

import { Project } from "./Project.tsx";
import { TProject } from "../../types/project.ts";
import "./project.css";

type ProjectSectionProps = {
  projectsData: TProject[];
};

export const ProjectSection = ({ projectsData }: ProjectSectionProps) => {
  return (
    <div>
      <h2
        style={{
          color: "rgb(0, 140, 233)",
          backgroundColor: "#000000da",
          width: "9%",
          margin: "0 auto 0 auto",
          borderRadius: "1em",
          padding:"0.3em"
        }}
      >
        Projects
      </h2>
      <div className="project-grid">
        {projectsData.map((projectData, idx) => (
          <Project key={idx} {...projectData} />
        ))}
      </div>
    </div>
  );
};

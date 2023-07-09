import { TProject } from "../../types/project";
import "./project.css";

export const Project = (projectData: TProject) => {
  return (
    <div className="project-grid-cell">
      <h3>{projectData.name}</h3>
      <a href={projectData.link}>Project Link</a>
      <p>{projectData.summary}</p>
      <div>
        {projectData.skills.map((skill, idx) => (
          <div key={idx}>
            <span>{skill}</span>
            {idx !== projectData.skills.length - 1 && <span> • </span>}
          </div>
        ))}
      </div>
    </div>
  );
};

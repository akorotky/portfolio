import { TProject } from "../../types/project";
import "./project.css";

export const Project = (projectData: TProject) => {
  return (
    <div className="project-grid-cell">
      <h3 style={{ color: "#FFD100" }}>{projectData.name}</h3>
      <a href={projectData.link}>Project Link</a>
      <p>{projectData.summary}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto 0 auto",
          color: "rgb(0, 140, 233)",
        }}
      >
        <strong style={{ color: "orange" }}>Skills Developed</strong>
        <ul style={{ textAlign: "start" }}>
          {projectData.skills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

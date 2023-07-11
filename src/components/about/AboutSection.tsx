import { TAbout } from "../../types/about";
import "./about.css";

export const AboutSection = (aboutData: TAbout) => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2 style={{ color: "#FFD100" }}>
          {"Hello, I'm "}
          <span style={{ color: "#1ae000" }}>Alex</span>
          {". Welcome to my portfolio!"}
        </h2>
        <p>{aboutData.summary.join(" ")}</p>
        <p style={{ color: "rgb(0, 140, 233)" }}>
          <strong style={{ color: "orange", marginRight: "0.35em" }}>
            Top interests:
          </strong>
          {aboutData.interests.join(" • ")}
        </p>
      </div>
    </div>
  );
};

import { TAbout } from "../../types/about";
import "./about.css";

export const AboutSection = (aboutData: TAbout) => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2 style={{ color: "#FFE000" }}>{aboutData.headline}</h2>
        <p>{aboutData.summary.join(" ")}</p>
        <p>
          <strong style={{ color: "#FFE000" }}>Top interests: </strong>
          {aboutData.interests.join(" • ")}
        </p>
      </div>
    </div>
  );
};

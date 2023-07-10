import { TAbout } from "../../types/about";
import "./about.css";

export const AboutSection = (aboutData: TAbout) => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2>{aboutData.headline}</h2>
        <p>{aboutData.summary}</p>
        <p>{aboutData.interests}</p>
      </div>
    </div>
  );
};

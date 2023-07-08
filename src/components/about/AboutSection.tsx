import { TAbout } from "../../types/about";

export const AboutSection = (aboutData: TAbout) => {
  const {
    programmingLanguages,
    frontendDevelopment,
    backendDevelopment,
    databases,
    cicd,
    developerTools,
  } = aboutData.skills;

  const skills = {
    "Programming Languages": programmingLanguages,
    "Frontend Development": frontendDevelopment,
    "Backend Development": backendDevelopment,
    Databases: databases,
    "CI/CD Tools": cicd,
    "Developer Tools": developerTools,
  };

  return (
    <div>
      <h2>{aboutData.headline}</h2>
      <p>{aboutData.summary}</p>
      <p>{aboutData.interests}</p>
      <div>
        {Object.keys(skills).map((category) => {
          const currentSkillSet = skills[category as keyof typeof skills];
          return (
            <div>
              <strong>{category}: </strong>
              {currentSkillSet?.map((skill, idx) => (
                <>
                  <span>{skill}</span>
                  {idx !== currentSkillSet?.length - 1 && <span> • </span>}
                </>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

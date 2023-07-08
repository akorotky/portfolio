type TAbout = {
  headline: string;
  summary: string[];
  interests: string;
  skills: TSkills;
};

type TSkills = {
    programmingLanguages?: string[]
    frontendDevelopment?: string[]
    backendDevelopment?: string[]
    databases?: string[]
    cicd?: string[]
    developerTools?: string[]
}

export type { TAbout };

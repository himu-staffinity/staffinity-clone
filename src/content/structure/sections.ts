export interface SectionHeadings {
  technologies: string;
  sectors: string;
  about: string;
  about_authors: string;
  collaboration: string;
}

export const sections: Record<string, SectionHeadings> = {
  en: {
    technologies: "TECHNOLOGIES",
    sectors: "SECTORS",
    about: "ABOUT",
    about_authors: "Authors",
    collaboration: "COLLABORATION",
  },
  de: {
    technologies: "TECHNOLOGIEN",
    sectors: "SEKTOREN",
    about: "ÜBER UNS",
    about_authors: "Autoren",
    collaboration: "ZUSAMMENARBEIT",
  },
};

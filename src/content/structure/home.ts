export interface HomeContent {
  expertise: {
    text: string;
    button: string;
    button_url: string;
  };
  collab_image_alt: string;
}

export const home: Record<string, HomeContent> = {
  en: {
    expertise: {
      text: "Our global experts make cutting-edge tech accessible and deliver top-notch software solutions tailored to your needs - without breaking the bank.",
      button: "More about us",
      button_url: "/en/about",
    },
    collab_image_alt: "Collaboration",
  },
  de: {
    expertise: {
      text: "Unsere globalen Experten machen modernste Technologie zugänglich und liefern erstklassige Softwarelösungen, die auf Ihre Bedürfnisse zugeschnitten sind - ohne Ihr Budget zu sprengen.",
      button: "Mehr über uns",
      button_url: "/about",
    },
    collab_image_alt: "Zusammenarbeit",
  },
};

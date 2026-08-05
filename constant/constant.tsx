import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { RiHome9Line, RiClapperboardLine, RiMagicLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoDocumentTextOutline } from "react-icons/io5";
import { ReactNode } from "react";

// The ReactNode type is correctly imported and used here
export type NavLink = {
  id: number;
  label: string | ReactNode; // Allows label to be a string OR a React element (JSX)
  url: string;
};
export type FootLink = {
  id: number;
  label: string | ReactNode; // Allows label to be a string OR a React element (JSX)
  url: string;
};

// Icon-only nav links need a visible-text stand-in for screen readers,
// since the label itself is just an SVG.
export type IconNavLink = {
  id: number;
  label: ReactNode;
  ariaLabel: string;
  url: string;
};

// Icons picked to read as "motion" rather than generic UI glyphs — a
// clapperboard for reels/projects, a wand for the playground/resources toys.
export const animateNavLinks: IconNavLink[] = [
  {
    id: 1,
    label: <RiHome9Line className="text-xl text-ink md:text-2xl" />,
    ariaLabel: "Home",
    url: "/animate",
  },
  {
    id: 2,
    label: <RiClapperboardLine className="text-xl text-ink md:text-2xl" />,
    ariaLabel: "Projects",
    url: "/animate/projects",
  },
  {
    id: 3,
    label: <RiMagicLine className="text-xl text-ink md:text-2xl" />,
    ariaLabel: "Resources",
    url: "/animate/resources",
  },
];

// Explicitly type the constant as NavLink[]
export const navLinks: NavLink[] = [
  {
    id: 1,
    label: <RiHome9Line className="text-2xl text-ink" />,
    url: "/build",
  },
  {
    id: 2,
    label: <CgProfile className="text-2xl text-ink" />,
    url: "/build#about",
  },
  {
    id: 3,
    // JSX is valid here because the file is .tsx
    label: <FaXTwitter className="text-xl text-ink" />,
    url: "https://x.com/mimi_codes", // Pro tip: use the actual URL here!
  },
  {
    id: 4,
    // JSX is valid here because the file is .tsx
    label: <FaGithub className="text-xl text-ink" />,
    url: "https://github.com/OkataMiracleDev", // Pro tip: use the actual URL here!
  },
  {
    id: 5,
    // JSX is valid here because the file is .tsx
    label: <IoDocumentTextOutline className="text-2xl text-blue-600" />,
    url: "/resume/okata-miracle-resume.docx", // Pro tip: link to your resume file!
  },
];

export const footLinks: FootLink[] = [
  {
    id: 1,
    // JSX is valid here because the file is .tsx
    label: <FaXTwitter className="text-xl text-ink" />,
    url: "https://x.com/mimi_codes", // Pro tip: use the actual URL here!
  },
  {
    id: 2,
    // JSX is valid here because the file is .tsx
    label: <FaGithub className="text-xl text-ink" />,
    url: "https://github.com/OkataMiracleDev", // Pro tip: use the actual URL here!
  },
];

import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { ReactNode } from "react";

// The ReactNode type is correctly imported and used here
export type NavLink = {
  id: number;
  label: string | ReactNode; // Allows label to be a string OR a React element (JSX)
  url: string;
};

// Explicitly type the constant as NavLink[]
export const navLinks: NavLink[] = [
  {
    id: 1,
    label: "Home",
    url: "#",
  },
  {
    id: 2,
    label: "About",
    url: "#",
  },
  {
    id: 3,
    // JSX is valid here because the file is .tsx
    label: <FaXTwitter className="text-xl" />, 
    url: "https://x.com/mimi_codes", // Pro tip: use the actual URL here!
  },
  {
    id: 4,
    // JSX is valid here because the file is .tsx
    label: <FaGithub className="text-xl" />,
    url: "https://github.com/OkataMiracleDev", // Pro tip: use the actual URL here!
  },
  {
    id: 5,
    // JSX is valid here because the file is .tsx
    label: <IoDocumentTextOutline className="text-xl" />,
    url: "#", // Pro tip: link to your resume file!
  },
];
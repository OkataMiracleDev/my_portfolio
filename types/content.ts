export interface ProjectContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  href: string;
}

export interface ResourceContent {
  id: string;
  slug: string;
  type: "download" | "tutorial" | "tool-link";
  title: string;
  description: string;
  fileUrl?: string;
  externalUrl?: string;
  tags: string[];
  publishedAt: string;
}

export interface TestimonialContent {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface MotionProjectContent extends ProjectContent {
  videoEmbedUrl?: string;
  processSteps?: { title: string; body: string }[];
  tools: string[];
  storyboardImages?: string[];
}

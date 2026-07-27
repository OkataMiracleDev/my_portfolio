import { db } from "@/lib/db/client";
import {
  devProjects,
  motionProjects,
  resources,
  testimonials,
  experienceEntries,
  funFactCards,
} from "@/lib/db/schema";
import { projectsData, homeprojectsData, testimonialData } from "@/data/data";
import { motionProjectsData } from "@/data/motion-projects";
import { resourcesData } from "@/data/resources";
import { motionTestimonialsData } from "@/data/motion-testimonials";
import { experienceData } from "@/data/experience";
import { funFactCards as landingFunFactCards } from "@/data/landing";

// homeprojectsData's projectID is a full path ("/build/projects/NEM");
// projectsData's projectID is the bare slug ("NEM"). This extracts the
// bare slug so featured status can be matched against projectsData's rows.
const featuredSlugs = new Set(homeprojectsData.map((p) => p.projectID.split("/").pop()));

async function migrateDevProjects() {
  const existing = await db.select().from(devProjects);
  if (existing.length > 0) {
    console.log("dev_projects already has rows, skipping.");
    return;
  }

  // projectsSliderData is not migrated separately — its fields (id, image,
  // name, description, link) are a strict subset of projectsData's, which
  // is the canonical source here (spec §1: unify the overlapping arrays).
  await db.insert(devProjects).values(
    projectsData.map((p, index) => ({
      slug: p.projectID, // kept verbatim (e.g. "NEM") to avoid breaking existing URLs
      name: p.name,
      subhead: p.subhead,
      description: p.description,
      image: p.image,
      image2: p.image2,
      image3: p.image3,
      technology: p.technology,
      date: p.date,
      type: p.type,
      client: p.client,
      link: p.link,
      featuredOnHome: featuredSlugs.has(p.projectID),
      sortOrder: index,
    }))
  );
  console.log(`Inserted ${projectsData.length} dev_projects rows.`);
}

async function migrateMotionProjects() {
  const existing = await db.select().from(motionProjects);
  if (existing.length > 0) {
    console.log("motion_projects already has rows, skipping.");
    return;
  }

  await db.insert(motionProjects).values(
    motionProjectsData.map((p, index) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      thumbnail: p.thumbnail,
      tags: p.tags,
      videoEmbedUrl: p.videoEmbedUrl ?? null,
      tools: p.tools,
      sortOrder: index,
    }))
  );
  console.log(`Inserted ${motionProjectsData.length} motion_projects rows.`);
}

async function migrateResources() {
  const existing = await db.select().from(resources);
  if (existing.length > 0) {
    console.log("resources already has rows, skipping.");
    return;
  }

  await db.insert(resources).values(
    resourcesData.map((r, index) => ({
      slug: r.slug,
      type: r.type,
      title: r.title,
      description: r.description,
      fileUrl: r.fileUrl ?? null,
      externalUrl: r.externalUrl ?? null,
      tags: r.tags,
      publishedAt: new Date(r.publishedAt),
      sortOrder: index,
    }))
  );
  console.log(`Inserted ${resourcesData.length} resources rows.`);
}

async function migrateTestimonials() {
  const existing = await db.select().from(testimonials);
  if (existing.length > 0) {
    console.log("testimonials already has rows, skipping.");
    return;
  }

  const buildRows = testimonialData.map((t, index) => ({
    route: "build" as const,
    name: t.name,
    role: null, // data/data.ts's testimonialData has no role field
    quote: t.review,
    avatar: t.image,
    sortOrder: index,
  }));

  const animateRows = motionTestimonialsData.map((t, index) => ({
    route: "animate" as const,
    name: t.name,
    role: t.role,
    quote: t.quote,
    avatar: t.avatar,
    sortOrder: index,
  }));

  await db.insert(testimonials).values([...buildRows, ...animateRows]);
  console.log(`Inserted ${buildRows.length + animateRows.length} testimonials rows.`);
}

async function migrateExperience() {
  const existing = await db.select().from(experienceEntries);
  if (existing.length > 0) {
    console.log("experience_entries already has rows, skipping.");
    return;
  }

  await db.insert(experienceEntries).values(
    experienceData.map((e, index) => ({
      year: e.year,
      role: e.role,
      company: e.company,
      description: e.description,
      technologies: e.technologies,
      sortOrder: index,
    }))
  );
  console.log(`Inserted ${experienceData.length} experience_entries rows.`);
}

async function migrateFunFacts() {
  const existing = await db.select().from(funFactCards);
  if (existing.length > 0) {
    console.log("fun_fact_cards already has rows, skipping.");
    return;
  }

  await db.insert(funFactCards).values(
    landingFunFactCards.map((f, index) => ({
      label: f.label,
      value: f.value,
      sortOrder: index,
    }))
  );
  console.log(`Inserted ${landingFunFactCards.length} fun_fact_cards rows.`);
}

// posts: nothing to migrate — it's a wholly new content type (spec §1),
// data/*.ts has no equivalent. It starts empty.

async function main() {
  await migrateDevProjects();
  await migrateMotionProjects();
  await migrateResources();
  await migrateTestimonials();
  await migrateExperience();
  await migrateFunFacts();
  console.log("Migration complete.");
}

main().then(() => process.exit(0));

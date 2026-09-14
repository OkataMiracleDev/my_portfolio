import pkg from "@/package.json";

export interface StackVersion {
  label: string;
  version: string;
}

/**
 * The versions actually installed, read from package.json.
 *
 * /animate's hero carries a running timecode; this is /build's equivalent --
 * the one piece of live, checkable data in its hero. Hardcoding "Next 15,
 * React 19" would start lying at the next upgrade and nobody would notice for
 * a year. Reading the manifest means the readout is either correct or the
 * build is broken.
 *
 * Server-only by convention: call it from a server component and pass the
 * result down, so package.json never ends up inlined in the client bundle.
 */
const RANGE_PREFIX = /^[\^~>=<\s]*/;

const TRACKED: Array<[dependency: string, label: string]> = [
  ["next", "next"],
  ["react", "react"],
  ["typescript", "ts"],
  ["tailwindcss", "tailwind"],
  ["gsap", "gsap"],
];

export function getStackVersions(): StackVersion[] {
  const deps: Record<string, string> = {
    ...(pkg.dependencies as Record<string, string>),
    ...(pkg.devDependencies as Record<string, string>),
  };

  return TRACKED.flatMap(([dependency, label]) => {
    const raw = deps[dependency];
    if (!raw) return [];
    // "^15.5.9" -> "15.5.9"; a git/file specifier yields nothing useful, so
    // drop it rather than printing a URL in a 11px mono readout.
    const version = raw.replace(RANGE_PREFIX, "");
    if (!/^\d/.test(version)) return [];
    return [{ label, version }];
  });
}

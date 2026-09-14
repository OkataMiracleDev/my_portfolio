"use client";

import type { ReactNode } from "react";
import { Meta } from "./brand/Hud";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";
import PlaygroundColorDial from "./Playground/PlaygroundColorDial";
import PlaygroundConfettiButton from "./Playground/PlaygroundConfettiButton";
import PlaygroundDraggableSticker from "./Playground/PlaygroundDraggableSticker";
import PlaygroundEtchPad from "./Playground/PlaygroundEtchPad";
import PlaygroundMagneticButton from "./Playground/PlaygroundMagneticButton";
import PlaygroundOrbit from "./Playground/PlaygroundOrbit";
import PlaygroundShapeMorph from "./Playground/PlaygroundShapeMorph";
import PlaygroundSlider from "./Playground/PlaygroundSlider";
import PlaygroundTiltCard from "./Playground/PlaygroundTiltCard";
import PlaygroundToggle from "./Playground/PlaygroundToggle";

/**
 * The toy drawer.
 *
 * These ten controls used to be scattered one-per-section down the page, each
 * floating in a corner behind the same reveal flag. That had two problems: the
 * toys read as debris rather than as a deliberate feature, and a visitor who
 * flipped the switch had no idea what had just changed anywhere below the
 * fold. Gathering them into a single labelled bay makes the switch mean
 * something -- one control, one visible result -- and gives the toys a frame
 * that says "these are demos" so nobody hunts for what they do.
 *
 * Every component is unchanged and still individually tested; only their
 * placement moved.
 */

function Bay({
  label,
  caption,
  children,
  className = "",
}: {
  label: string;
  caption: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <li
      className={`flex min-h-[13rem] flex-col justify-between gap-6 rounded-2xl border border-ink/10 bg-frame/50 p-5 ${className}`}
    >
      <div className="flex min-h-[6rem] flex-1 items-center justify-center">
        {children}
      </div>
      <div>
        <Meta className="block text-ink/55">{label}</Meta>
        <p className="mt-1.5 text-xs leading-relaxed text-ink/35">{caption}</p>
      </div>
    </li>
  );
}

export default function PlaygroundBay() {
  const { revealed } = usePlaygroundReveal();

  return (
    <section
      id="playground"
      aria-label="Interaction playground"
      // Collapsed to zero height rather than unmounted, so the drawer can
      // transition both ways and the toys keep whatever state a visitor left
      // them in. grid-template-rows 0fr -> 1fr is the one way to transition to
      // an unknown content height without measuring it in JS. It does cost a
      // layout pass per frame, unlike the transform/opacity work everywhere
      // else on this route -- acceptable for a 500ms one-shot on an explicit
      // click, and not acceptable for anything scroll-driven.
      className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        revealed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
      // inert, not aria-hidden. The drawer holds ten real focusable controls;
      // aria-hidden alone would hide them from screen readers while leaving
      // them in the tab order, which strands a keyboard user on a control they
      // cannot see and their reader will not announce. inert removes them from
      // both, and lifts the moment the drawer opens.
      inert={!revealed}
    >
      <div className="min-h-0">
        <div className="border-y border-ink/10 px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-[84rem]">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Meta className="mb-4 block text-signal">Eye candy</Meta>
                <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold leading-[0.95] tracking-tight text-ink md:text-5xl">
                  Things that do nothing<span className="text-signal">.</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink/45">
                Ten controls wired to absolutely nothing. They exist because
                interaction is the medium, and a motion portfolio that you can
                only look at is a brochure.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Bay label="Toggle" caption="Spring, low bounce. Settles, never wobbles.">
                <PlaygroundToggle />
              </Bay>
              <Bay label="Magnetic" caption="Follows the cursor on a spring, not a raw offset.">
                <PlaygroundMagneticButton />
              </Bay>
              <Bay label="Slider" caption="A real range input underneath the paint.">
                <div className="w-full px-2">
                  <PlaygroundSlider />
                </div>
              </Bay>
              <Bay label="Colour dial" caption="Hue on a wheel.">
                <PlaygroundColorDial />
              </Bay>
              <Bay label="Confetti" caption="The one thing here allowed to be loud.">
                <PlaygroundConfettiButton />
              </Bay>
              <Bay label="Shape morph" caption="One path interpolating into another.">
                <PlaygroundShapeMorph />
              </Bay>
              <Bay label="Orbit" caption="3D transforms, no library.">
                <PlaygroundOrbit />
              </Bay>
              <Bay label="Tilt card" caption="Perspective tracking the pointer.">
                <PlaygroundTiltCard />
              </Bay>
              <Bay label="Sticker" caption="Drag it. It has pointer capture, so it will not drop." className="sm:col-span-2">
                <PlaygroundDraggableSticker />
              </Bay>
              <Bay label="Etch pad" caption="Draw something. It will not be saved." className="sm:col-span-2">
                <PlaygroundEtchPad />
              </Bay>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

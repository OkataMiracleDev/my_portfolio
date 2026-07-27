"use client";

import { useEffect, useRef, useState } from "react";

interface ExpandableTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
}

export default function ExpandableText({ text, className = "", linkClassName = "" }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  return (
    <div>
      <p ref={ref} className={`${className} ${expanded ? "" : "line-clamp-3"}`}>
        {text}
      </p>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className={`mt-2 text-sm font-medium hover:underline ${linkClassName}`}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

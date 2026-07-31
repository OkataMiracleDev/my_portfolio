// Escaping "<" prevents a "</script>" sequence inside stringified data from
// prematurely closing this tag — JSON.stringify alone doesn't escape it.
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

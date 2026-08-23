"use client";

export interface LineItem {
  section?: string;
  title: string;
  description: string;
  price: string;
  unit: string;
}

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  sectioned?: boolean;
}

export default function LineItemsEditor({ items, onChange, sectioned = false }: LineItemsEditorProps) {
  function updateItem(index: number, field: keyof LineItem, value: string) {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    onChange([...items, { section: "", title: "", description: "", price: "", unit: "" }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/70">Line items</label>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-ink/15 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/40">
                Item {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            {sectioned && (
              <input
                value={item.section ?? ""}
                onChange={(e) => updateItem(i, "section", e.target.value)}
                placeholder="Section (e.g. Project work, Retainer, Add-ons)"
                className="mb-2 w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-sm text-accent-animate focus:outline-none focus:ring-2 focus:ring-accent-animate"
              />
            )}
            <input
              value={item.title}
              onChange={(e) => updateItem(i, "title", e.target.value)}
              placeholder="Title (e.g. Brand Animation)"
              className="mb-2 w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
            />
            <textarea
              value={item.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
              placeholder="What's included"
              rows={2}
              className="mb-2 w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={item.price}
                onChange={(e) => updateItem(i, "price", e.target.value)}
                placeholder="Price (e.g. $800 – $1,500)"
                className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
              />
              <input
                value={item.unit}
                onChange={(e) => updateItem(i, "unit", e.target.value)}
                placeholder="Unit (e.g. Per deliverable)"
                className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-accent-animate"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-3 rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
      >
        + Add line item
      </button>
    </div>
  );
}

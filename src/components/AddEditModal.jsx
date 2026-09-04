import { useState } from "react";

export default function AddEditModal({ title, fields, onClose, onSubmit }) {
  const [values, setValues] = useState(
    Object.fromEntries(fields.map((f) => [f.name, f.default || ""])),
  );

  const submit = (e) => {
    e.preventDefault();
    const hasAllValues = fields.every((field) =>
      String(values[field.name] ?? "").trim(),
    );

    if (!hasAllValues) return;
    onSubmit(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0b0e]/80 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <form
        className="w-full max-w-sm rounded-2xl border border-[#1a1c22] bg-[#0d0e12] p-6 shadow-2xl shadow-black/40"
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-semibold text-[#f2f3f5]">{title}</h2>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#5c5e68] transition hover:bg-[#121317] hover:text-[#e8e9ec]"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1.5 block text-[11px] font-medium text-[#8b8d96]">
                {f.label}
              </span>
              {f.type === "select" ? (
                <select
                  value={values[f.name]}
                  onChange={(e) =>
                    setValues({ ...values, [f.name]: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-[#1f2128] bg-[#121317] px-3 py-2 text-[12px] text-[#e8e9ec] outline-none transition hover:border-[#2a2d36] focus:border-[#ff7100]/50 focus:bg-[#15171d]"
                >
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  autoFocus={f.name === fields[0].name}
                  value={values[f.name]}
                  onChange={(e) =>
                    setValues({ ...values, [f.name]: e.target.value })
                  }
                  placeholder={f.placeholder}
                  required
                  className="w-full rounded-lg border border-[#1f2128] bg-[#121317] px-3 py-2 text-[12px] text-[#e8e9ec] outline-none transition placeholder:text-[#5c5e68] hover:border-[#2a2d36] focus:border-[#ff7100]/50 focus:bg-[#15171d]"
                />
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-lg px-4 py-2 text-[12px] font-medium text-[#8b8d96] transition hover:bg-[#121317] hover:text-[#e8e9ec]"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-[#ff7100] px-4 py-2 text-[12px] font-semibold text-[#06110d] shadow-[0_0_0_1px_rgba(255,113,0,0.3)] transition hover:bg-[#ff7d19] active:scale-[0.97]"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

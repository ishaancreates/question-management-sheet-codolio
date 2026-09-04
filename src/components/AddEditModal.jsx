import { useState } from "react";

export default function AddEditModal({ title, fields, onClose, onSubmit }) {
  const [values, setValues] = useState(
    Object.fromEntries(fields.map((f) => [f.name, f.default || ""])),
  );

  const submit = (e) => {
    e.preventDefault();
    if (!values[fields[0].name]?.trim()) return; // first field required
    onSubmit(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <form
        className="w-full max-w-sm rounded-2xl border border-slate-700/60 bg-slate-900 p-6 shadow-2xl shadow-black/40"
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button
            className="text-slate-500 hover:text-slate-200 transition rounded-full w-7 h-7 flex items-center justify-center hover:bg-slate-800"
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
              <span className="text-xs font-medium text-slate-400 mb-1.5 block">
                {f.label}
              </span>
              {f.type === "select" ? (
                <select
                  value={values[f.name]}
                  onChange={(e) =>
                    setValues({ ...values, [f.name]: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
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
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 active:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

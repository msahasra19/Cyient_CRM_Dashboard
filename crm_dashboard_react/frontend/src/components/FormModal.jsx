/**
 * FormModal.jsx — dynamic add/edit form (port of UI.openForm)
 * ==========================================================
 * Renders a modal whose fields are driven by an entity config's `fields`
 * array. Resolves async FK option providers, validates required fields, and
 * calls onSubmit(values) with cleaned values (numbers coerced, '' -> null).
 * Uses the original markup/classes (#modal-fields grid, .field, .field-full,
 * .has-error, .req) so the existing CSS styles it identically.
 */
import React, { useEffect, useState } from 'react';

export function FormModal({ title, fields, initialValues = {}, onSubmit, onCancel }) {
  const [resolvedFields, setResolvedFields] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  // Resolve any async option providers, then seed initial values.
  useEffect(() => {
    let alive = true;
    (async () => {
      const rf = await Promise.all(
        fields.map(async (f) => (typeof f.options === 'function' ? { ...f, options: await f.options() } : f))
      );
      if (!alive) return;
      const seed = {};
      rf.forEach((f) => {
        const v = initialValues[f.key];
        seed[f.key] = v === undefined || v === null ? '' : v;
      });
      setResolvedFields(rf);
      setValues(seed);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (key, v) => setValues((s) => ({ ...s, [key]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const out = {};
    const errs = {};
    let valid = true;
    resolvedFields.forEach((f) => {
      let v = values[f.key];
      if (f.type === 'number') {
        v = v === '' || v === null ? null : Number(v);
        if (v !== null && Number.isNaN(v)) v = null;
      }
      if (f.required && (v === '' || v === null || v === undefined)) {
        errs[f.key] = true;
        valid = false;
      }
      out[f.key] = v === '' ? null : v;
    });
    setErrors(errs);
    if (!valid) return;
    onSubmit(out);
  };

  const backdropDown = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  // Render nothing until async options are ready (keeps it simple).
  if (!resolvedFields) {
    return (
      <div className="modal-backdrop" onMouseDown={backdropDown}>
        <div className="modal">
          <div className="loader">
            <div className="spinner" />
            <div>Loading…</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onMouseDown={backdropDown}>
      <div className="modal">
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" type="button" title="Close" onClick={onCancel}>
            ×
          </button>
        </header>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div id="modal-fields">
            {resolvedFields.map((f) => (
              <Field
                key={f.key}
                f={f}
                value={values[f.key] ?? ''}
                error={!!errors[f.key]}
                onChange={(v) => setField(f.key, v)}
              />
            ))}
          </div>
          <footer className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

function Field({ f, value, error, onChange }) {
  const wrapperClass = 'field' + (f.full ? ' field-full' : '') + (error ? ' has-error' : '');
  const label = (
    <label htmlFor={`f-${f.key}`}>
      {f.label}
      {f.required && <span className="req">*</span>}
    </label>
  );

  let input;
  if (f.type === 'textarea') {
    input = (
      <textarea
        id={`f-${f.key}`}
        name={f.key}
        placeholder={f.placeholder || ''}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  } else if (f.type === 'select') {
    const options = (f.options || []).map((o) =>
      typeof o === 'object' ? o : { value: o, label: o }
    );
    input = (
      <select id={`f-${f.key}`} name={f.key} value={value} onChange={(e) => onChange(e.target.value)}>
        {!f.required && <option value="">— select —</option>}
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    input = (
      <input
        id={`f-${f.key}`}
        name={f.key}
        type={f.type || 'text'}
        value={value}
        placeholder={f.placeholder || ''}
        min={f.min}
        max={f.max}
        step={f.step}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div className={wrapperClass}>
      {label}
      {input}
      <div className="error-text">Required</div>
    </div>
  );
}

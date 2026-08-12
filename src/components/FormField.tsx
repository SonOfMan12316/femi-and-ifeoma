"use client";

import { useState, useRef, useEffect } from "react";
import type { InputHTMLAttributes } from "react";

/**
 * Form field components. Spec: docs/03-COMPONENT_GUIDELINES.md § Forms & Inputs.
 *
 * - Rounded border, orange focus ring
 * - Custom Select replaces native browser styling
 */

// ─── TextInput ────────────────────────────────────────────────────────────────

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  error?: string;
};

export function TextInput({ label, error, id, ...rest }: TextInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[12px] font-medium uppercase tracking-[0.1em] text-black/60">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] font-light text-black outline-none transition-colors duration-200 placeholder:text-black/30 focus:border-orange focus:ring-2 focus:ring-orange/20 ${
          error ? "border-red-400" : "border-[var(--ink-line)]"
        }`}
        {...rest}
      />
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

type SelectOption = { value: string; label: string };

type SelectProps = {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export function Select({ label, options, value, onChange, placeholder = "Select…", error }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-black/60">{label}</span>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-[15px] font-light outline-none transition-colors duration-200 focus:border-orange focus:ring-2 focus:ring-orange/20 ${
            error ? "border-red-400" : "border-[var(--ink-line)]"
          } ${selected ? "text-black" : "text-black/30"}`}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            aria-hidden="true"
            className={`shrink-0 text-black/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-[var(--ink-line)] bg-white shadow-[0_8px_24px_rgba(12,12,12,0.12)]"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`cursor-pointer px-4 py-3 text-[15px] font-light transition-colors hover:bg-cream ${
                  opt.value === value ? "text-orange" : "text-black"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

// Re-export for a single import point
export type { SelectOption, TextInputProps };

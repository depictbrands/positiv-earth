"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import type { QuizContactFormQuestion, QuizContactValues } from "@/types/quiz-content";

type QuizContactFormProps = {
  content: QuizContactFormQuestion;
  values: QuizContactValues;
  onChange: (field: keyof QuizContactValues, value: string) => void;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

// Full list of sovereign countries (alphabetical). The country picker is a
// fixed, app-owned control rather than CMS content, so the list lives inline.
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
  "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
  "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Côte d'Ivoire",
  "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
] as const;

const underlineClassName =
  "w-full border-0 border-b border-base-white bg-transparent pb-2 font-body text-body-1 text-base-white placeholder:text-base-white/60 focus:outline-none focus-visible:border-b-2";

// A single underline text field (label above the line).
function Field({
  id,
  label,
  type = "text",
  value,
  onValueChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex w-full flex-col gap-[var(--spacing-quiz-field-gap)]"
    >
      <span className="font-body text-body-1 text-base-white">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={underlineClassName}
      />
    </label>
  );
}

// A searchable country picker styled to match the underline fields: an input
// that filters the full country list, with a keyboard-navigable listbox. The
// label doubles as the placeholder (no visible label, matching the design's
// country select). Selection / value live in the shell via onValueChange.
function CountryCombobox({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...COUNTRIES];
    return COUNTRIES.filter((country) => country.toLowerCase().includes(q));
  }, [query]);

  // Close when clicking outside the control.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const openList = () => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
  };

  const selectCountry = (country: string) => {
    onValueChange(country);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openList();
          return;
        }
        setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Enter":
        if (open && filtered[activeIndex]) {
          event.preventDefault();
          selectCountry(filtered[activeIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label={label}
        aria-activedescendant={
          open && filtered[activeIndex] ? `${listId}-${activeIndex}` : undefined
        }
        value={open ? query : value}
        placeholder={label}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={openList}
        onClick={openList}
        onKeyDown={onKeyDown}
        className="w-full border-0 border-b border-base-white bg-transparent pb-2 pr-8 font-body text-body-1 text-base-white placeholder:text-base-white/60 focus:outline-none focus-visible:border-b-2"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cn(
          "pointer-events-none absolute bottom-3 right-0 size-6 text-base-white transition-transform",
          open && "rotate-180",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[calc(var(--size-quiz-input-height)*5)] overflow-y-auto rounded-card-corner border border-base-white/20 bg-base-black py-2"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-2 font-body text-body-1 text-base-white/60">
              No matches
            </li>
          ) : (
            filtered.map((country, index) => {
              const isActive = index === activeIndex;
              const isSelected = country === value;
              return (
                <li
                  key={country}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  data-active={isActive}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectCountry(country);
                  }}
                  className={cn(
                    "cursor-pointer px-4 py-2 font-body text-body-1 text-base-white",
                    isActive && "bg-base-white/10",
                    isSelected && "bg-base-white/15",
                  )}
                >
                  {country}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}

// The contact lead form (Figma node 957:924): underline fields laid out as
// First/Last name, then Phone/Email/Country, then Additional Notes. Purely
// presentational — values + submission live in the shell.
export default function QuizContactForm({
  content,
  values,
  onChange,
}: QuizContactFormProps) {
  return (
    <div className="mx-auto flex w-full max-w-[var(--size-quiz-form-width)] flex-col gap-[var(--spacing-quiz-form-row-gap)]">
      {/* First / Last name */}
      <div className="flex flex-wrap gap-x-[var(--spacing-quiz-form-col-gap)] gap-y-[var(--spacing-quiz-form-row-gap)]">
        <div className="min-w-[16rem] flex-1">
          <Field
            id="quiz-first-name"
            label={content.firstNameLabel}
            value={values.firstName}
            onValueChange={(value) => onChange("firstName", value)}
          />
        </div>
        <div className="min-w-[16rem] flex-1">
          <Field
            id="quiz-last-name"
            label={content.lastNameLabel}
            value={values.lastName}
            onValueChange={(value) => onChange("lastName", value)}
          />
        </div>
      </div>

      {/* Phone / Email / Country */}
      <div className="flex flex-wrap items-end gap-x-[var(--spacing-quiz-form-col-gap)] gap-y-[var(--spacing-quiz-form-row-gap)]">
        <div className="min-w-[12rem] flex-1">
          <Field
            id="quiz-phone"
            label={content.phoneLabel}
            type="tel"
            value={values.phone}
            onValueChange={(value) => onChange("phone", value)}
          />
        </div>
        <div className="min-w-[12rem] flex-1">
          <Field
            id="quiz-email"
            label={content.emailLabel}
            type="email"
            value={values.email}
            onValueChange={(value) => onChange("email", value)}
          />
        </div>

        {/* Country — searchable combobox over the full country list. */}
        <div className="min-w-[12rem] flex-1">
          <CountryCombobox
            label={content.countryLabel}
            value={values.country}
            onValueChange={(value) => onChange("country", value)}
          />
        </div>
      </div>

      {/* Additional notes */}
      <label
        htmlFor="quiz-notes"
        className="flex w-full flex-col gap-[var(--spacing-quiz-form-row-gap)]"
      >
        <span className="font-body text-body-1 text-base-white">
          {content.notesLabel}
        </span>
        <input
          id="quiz-notes"
          type="text"
          value={values.notes}
          onChange={(event) => onChange("notes", event.target.value)}
          className={underlineClassName}
        />
      </label>
    </div>
  );
}

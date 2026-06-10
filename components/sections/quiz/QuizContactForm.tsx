import type { QuizContactFormQuestion, QuizContactValues } from "@/types/quiz-content";

type QuizContactFormProps = {
  content: QuizContactFormQuestion;
  values: QuizContactValues;
  onChange: (field: keyof QuizContactValues, value: string) => void;
};

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

        {/* Country — underline select with a chevron; the label is the placeholder. */}
        <div className="relative min-w-[12rem] flex-1">
          <select
            aria-label={content.countryLabel}
            value={values.country}
            onChange={(event) => onChange("country", event.target.value)}
            className="w-full appearance-none border-0 border-b border-base-white bg-transparent pb-2 pr-8 font-body text-body-1 text-base-white focus:outline-none focus-visible:border-b-2"
          >
            <option value="" disabled>
              {content.countryLabel}
            </option>
            {content.countryOptions.map((country) => (
              <option key={country} value={country} className="text-base-black">
                {country}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute bottom-3 right-0 size-6 text-base-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
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

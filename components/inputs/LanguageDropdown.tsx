import { Dropdown, type DropdownItem } from "../primitives/Dropdown";
import { getLanguage, LANGUAGES } from "@/lib/languages";
import type { LangCode } from "@/lib/types";

interface Props {
  value: LangCode;
  onChange: (value: LangCode) => void;
}

/** Dropdown z 9 językami docelowymi — flaga + kod + pełna nazwa. */
export function LanguageDropdown({ value, onChange }: Props) {
  const items: DropdownItem<LangCode>[] = LANGUAGES.map((language) => ({
    value: language.code,
    label: language.displayName,
  }));

  return (
    <Dropdown<LangCode>
      placeholder="Wybierz język"
      ariaLabel="Język docelowy"
      value={value}
      items={items}
      onChange={onChange}
      renderSelected={(item) => {
        const language = getLanguage(item.value);
        return (
          <span className="flex items-center gap-2">
            <span aria-hidden className="text-base leading-none">{language.flag}</span>
            <span className="font-medium text-ink-900">{language.short}</span>
            <span aria-hidden className="text-ink-400">·</span>
            <span className="text-sm text-ink-700">{language.displayName}</span>
          </span>
        );
      }}
      renderItem={(item) => {
        const language = getLanguage(item.value);
        return (
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="text-base leading-none">{language.flag}</span>
            <span className="min-w-[3.5rem] font-mono text-[12px] tracking-wide text-ink-700">
              {language.short}
            </span>
            <span className="text-ink-800">{language.displayName}</span>
          </div>
        );
      }}
    />
  );
}

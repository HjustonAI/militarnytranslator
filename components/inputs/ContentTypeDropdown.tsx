import { Dropdown, type DropdownItem } from "../primitives/Dropdown";
import { getGroupedProfiles, getProfile } from "@/lib/profiles";
import type { ProfileId } from "@/lib/types";

interface Props {
  value: ProfileId;
  onChange: (value: ProfileId) => void;
}

/** Dropdown z 11 profilami treści, pogrupowanymi wizualnie. */
export function ContentTypeDropdown({ value, onChange }: Props) {
  const items: DropdownItem<ProfileId>[] = [];
  for (const { group, profiles } of getGroupedProfiles()) {
    for (const profile of profiles) {
      items.push({
        value: profile.id,
        label: profile.displayName,
        groupLabel: group,
      });
    }
  }

  return (
    <Dropdown<ProfileId>
      placeholder="Wybierz typ treści"
      ariaLabel="Typ treści"
      value={value}
      items={items}
      onChange={onChange}
      renderSelected={(item) => {
        const profile = getProfile(item.value);
        return (
          <span className="flex flex-col gap-0.5">
            <span className="font-medium text-ink-900">{profile.displayName}</span>
            <span className="text-[11px] text-ink-500">{profile.hint}</span>
          </span>
        );
      }}
      renderItem={(item) => {
        const profile = getProfile(item.value);
        return (
          <div className="flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium">{profile.displayName}</div>
              <div className="text-[11px] text-ink-500">{profile.hint}</div>
            </div>
            <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[9.5px] tracking-wide text-ink-600">
              {profile.badge}
            </code>
          </div>
        );
      }}
      panelMaxHeight={460}
    />
  );
}

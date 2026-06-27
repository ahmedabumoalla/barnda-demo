type EntitySelectOption = {
  id: string;
  label: string;
  meta?: string;
};

type EntitySelectProps = {
  label: string;
  value: string;
  options: EntitySelectOption[];
  onChange: (value: string) => void;
  actionLabel?: string;
  onAction?: () => void;
};

export function EntitySelect({
  label,
  value,
  options,
  onChange,
  actionLabel,
  onAction,
}: EntitySelectProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-black text-[#6D5544]">
        <span>{label}</span>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="rounded-[8px] border border-[#D9BD87] bg-[#F8E8C9] px-3 py-1 text-[11px] font-black text-[#6B431C] transition hover:bg-[#F1D9A8]"
          >
            {actionLabel}
          </button>
        ) : null}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[8px] border border-[#E1D1BD] bg-white px-3 text-sm font-bold text-[#2F241D] outline-none transition focus:border-[#B88334] focus:ring-2 focus:ring-[#D9A33F]/20"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.meta ? `${option.label} - ${option.meta}` : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

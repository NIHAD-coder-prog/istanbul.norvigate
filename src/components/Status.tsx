export type StatusKey = "live" | "beta" | "dev" | "plan";
export function Status({ kind, label }: { kind: StatusKey; label: string }) {
  return (
    <span className="st">
      <i className={`sd s-${kind}`} aria-hidden="true" />
      {label}
    </span>
  );
}

"use client";
import { Dropdown } from "./Dropdown";
import { Chevron } from "./Icons";

/** Desktop "More" menu: the pages that do not fit in the short primary menu. */
export function MoreMenu({ label, links }: { label: string; links: { href: string; label: string }[] }) {
  return (
    <Dropdown label={label} className="navmore" triggerClassName="navbtn" trigger={<>{label}<Chevron /></>}>
      {(close) => links.map((l) => (<li key={l.href}><a href={l.href} onClick={close}>{l.label}</a></li>))}
    </Dropdown>
  );
}

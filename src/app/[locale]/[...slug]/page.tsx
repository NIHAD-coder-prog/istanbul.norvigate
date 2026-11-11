import { notFound } from "next/navigation";

/** Every real page has its own route; anything else under a language prefix is a genuine, localized 404. */
export default function CatchAll() {
  notFound();
}

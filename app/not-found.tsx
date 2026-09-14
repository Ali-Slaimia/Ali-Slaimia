import Link from "next/link";
import { Pip } from "@/components/Pip";

export default function NotFound() {
  return (
    <div className="screen empty">
      <Pip mood="oops" size={120} />
      <h1>404 — off the trail</h1>
      <p className="lede">That path does not exist. Head back to the skill tree.</p>
      <Link href="/" className="btn primary">
        Learn
      </Link>
    </div>
  );
}

import { ViewHeader } from "@/components/sections/view-primitives";
import { ThoughtRolodex } from "@/components/thought-rolodex/thought-rolodex";

export default function ThoughtRolodexPage() {
  return (
    <section className="space-y-6">
      <ViewHeader
        eyebrow="Thought Rolodex"
        title="A sharper way to browse the archive."
        description="Quotes, product takes, and working principles collected into a dedicated interactive surface."
      />

      <ThoughtRolodex variant="page" />
    </section>
  );
}

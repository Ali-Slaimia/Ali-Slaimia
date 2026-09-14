import { LessonPlayer } from "@/components/LessonPlayer";
import { catalog } from "@/content/catalog";

export function generateStaticParams() {
  return catalog.flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      unitId: unit.id,
      lessonId: lesson.id,
    })),
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ unitId: string; lessonId: string }>;
}) {
  const { unitId, lessonId } = await params;
  return <LessonPlayer unitId={unitId} lessonId={lessonId} />;
}

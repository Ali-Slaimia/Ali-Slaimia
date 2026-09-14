import { LessonClient } from "./lesson-client";
import { TRACKS, allLessons } from "@/lib/curriculum";

export function generateStaticParams() {
  return TRACKS.flatMap((track) =>
    allLessons(track).map((lesson) => ({ lessonId: lesson.id })),
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return <LessonClient lessonId={lessonId} />;
}

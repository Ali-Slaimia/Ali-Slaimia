"use client";

import { LessonPlayer } from "@/components/LessonPlayer";
import { findLesson } from "@/lib/curriculum";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const found = findLesson(params.lessonId);

  if (!found) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center justify-center gap-3 bg-sheet px-6 text-center">
        <p className="text-2xl font-black">Lesson not found</p>
        <Link href="/" className="font-extrabold text-mint-dark">
          Back to the path
        </Link>
      </div>
    );
  }

  return <LessonPlayer lesson={found.lesson} />;
}

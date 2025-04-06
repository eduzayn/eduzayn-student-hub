
import React from "react";
import { CheckCircle, Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LearnWorldsLesson } from "@/services/learnworlds-api";

interface LessonListProps {
  lessons: LearnWorldsLesson[];
  currentLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const LessonList: React.FC<LessonListProps> = ({ lessons, currentLessonId, onSelectLesson }) => {
  return (
    <div className="space-y-1">
      <h3 className="font-medium text-lg mb-3">Aulas do Curso</h3>
      <div className="space-y-2">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            className={cn(
              "flex items-start p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors",
              currentLessonId === lesson.id && "bg-gray-100",
              lesson.completed && "border-l-2 border-green-500"
            )}
          >
            <div className="flex-shrink-0 mr-3 mt-1">
              {lesson.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : currentLessonId === lesson.id ? (
                <Play className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-grow">
              <h4 className="font-medium">{lesson.title}</h4>
              <p className="text-sm text-muted-foreground">{lesson.description}</p>
              <div className="mt-1 text-xs text-muted-foreground">
                Duração: {formatDuration(lesson.duration)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonList;

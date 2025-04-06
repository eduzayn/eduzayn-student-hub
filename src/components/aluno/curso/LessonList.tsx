
import React from "react";
import { CheckCircle, Circle, Play, Lock, Clock } from "lucide-react";
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
              "flex items-start p-3 rounded-lg cursor-pointer transition-all",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              currentLessonId === lesson.id ? "bg-gray-100 dark:bg-gray-800" : "",
              lesson.completed ? "border-l-2 border-green-500" : "border-l-2 border-transparent",
              lesson.locked ? "opacity-70" : ""
            )}
          >
            <div className="flex-shrink-0 mr-3 mt-1">
              {lesson.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : lesson.locked ? (
                <Lock className="h-5 w-5 text-gray-400" />
              ) : currentLessonId === lesson.id ? (
                <Play className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-grow">
              <h4 className={cn(
                "font-medium",
                lesson.locked ? "text-muted-foreground" : ""
              )}>
                {lesson.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDuration(lesson.duration)}</span>
                
                {lesson.completed && (
                  <span className="ml-3 px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-medium dark:bg-green-900 dark:text-green-200">
                    Concluída
                  </span>
                )}
                
                {lesson.locked && (
                  <span className="ml-3 px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-[10px] font-medium dark:bg-gray-800 dark:text-gray-200">
                    Bloqueada
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonList;

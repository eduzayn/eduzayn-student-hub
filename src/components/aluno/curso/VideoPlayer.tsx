
import React, { useRef, useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { type LearnWorldsLesson } from "@/services/learnworlds-api";
import { trackVideoProgress, markLessonAsCompleted } from "@/services/learnworlds-api";

interface VideoPlayerProps {
  lesson: LearnWorldsLesson;
  courseId: string;
  userId: string;
  onComplete: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson, courseId, userId, onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(lesson.completed);
  const [progressTracking, setProgressTracking] = useState({
    lastTracked: 0,
    totalWatched: 0,
  });
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Configuração inicial do player e eventListeners
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setIsCompleted(lesson.completed);
    
    const handleIframeLoad = () => {
      setIsLoading(false);
    };
    
    if (videoRef.current) {
      videoRef.current.addEventListener('load', handleIframeLoad);
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('load', handleIframeLoad);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [lesson]);
  
  // Simula o rastreamento de progresso a cada 30 segundos
  useEffect(() => {
    if (!isLoading && !error) {
      progressIntervalRef.current = window.setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        if (now - progressTracking.lastTracked >= 30) {
          trackVideoProgress(courseId, lesson.id, userId, progressTracking.totalWatched)
            .catch(err => console.error("Erro ao rastrear progresso:", err));
          
          setProgressTracking(prev => ({
            lastTracked: now,
            totalWatched: prev.totalWatched + 30
          }));
          
          // Se assistiu mais de 90% do vídeo, marca como concluído automaticamente
          if (!isCompleted && progressTracking.totalWatched > lesson.duration * 0.9) {
            handleMarkComplete();
          }
        }
      }, 5000);
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isLoading, error, progressTracking.lastTracked, isCompleted, courseId, lesson.id, lesson.duration, userId]);
  
  const handleMarkComplete = async () => {
    try {
      await markLessonAsCompleted(courseId, lesson.id, userId);
      setIsCompleted(true);
      onComplete();
    } catch (err) {
      console.error("Erro ao marcar aula como concluída:", err);
      setError("Não foi possível marcar a aula como concluída. Tente novamente.");
    }
  };
  
  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="bg-gray-200 animate-pulse aspect-video w-full rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Carregando vídeo...</span>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className={`${isLoading ? 'hidden' : 'block'} aspect-video w-full rounded-lg overflow-hidden shadow-lg`}>
        <iframe
          ref={videoRef}
          src={lesson.videoUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <p className="text-muted-foreground">{lesson.description}</p>
        </div>
        
        {isCompleted ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Concluído</span>
          </div>
        ) : (
          <Button onClick={handleMarkComplete} disabled={isLoading}>
            Marcar como Concluída
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;

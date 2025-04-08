
import React from "react";
import LearnWorldsErrorAlert from "../LearnWorldsErrorAlert";

interface MatriculaErrorDisplayProps {
  offlineMode: boolean;
}

const MatriculaErrorDisplay: React.FC<MatriculaErrorDisplayProps> = ({ offlineMode }) => {
  if (!offlineMode) return null;

  return (
    <LearnWorldsErrorAlert 
      errorMessage="A API do LearnWorlds está offline ou indisponível no momento."
    />
  );
};

export default MatriculaErrorDisplay;

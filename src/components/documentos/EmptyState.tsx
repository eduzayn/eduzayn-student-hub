
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, FileX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileX className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">{title}</p>
        <p className="text-muted-foreground text-center">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </CardContent>
    </Card>
  );
};

export default EmptyState;

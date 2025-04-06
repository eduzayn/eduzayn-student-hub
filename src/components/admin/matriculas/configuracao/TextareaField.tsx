
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";

interface TextareaFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  rows?: number;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  className,
  rows = 5
}) => {
  return (
    <FormField form={form} name={name} label={label} className={className}>
      <Textarea
        placeholder={placeholder}
        className={`h-${rows * 6}`}
        {...form.register(name)}
      />
    </FormField>
  );
};

export default TextareaField;

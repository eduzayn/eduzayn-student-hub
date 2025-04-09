
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface TextareaFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ 
  form, 
  name, 
  label, 
  placeholder,
  className,
  rows = 4
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={placeholder} 
              className="resize-none" 
              rows={rows} 
              {...field} 
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default TextareaField;

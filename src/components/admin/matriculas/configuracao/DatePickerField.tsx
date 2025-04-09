
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DatePickerFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  className?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  form, 
  name, 
  label, 
  className 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              {...field} 
              value={typeof field.value === 'string' ? field.value : field.value?.toISOString().split('T')[0]}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;

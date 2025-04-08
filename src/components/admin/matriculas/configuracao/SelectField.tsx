
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: SelectOption[];
  placeholder: string;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  form,
  name,
  label,
  options,
  placeholder,
  className
}) => {
  return (
    <FormField form={form} name={name} label={label} className={className}>
      {field => (
        <Select
          value={field.value}
          onValueChange={(value) => field.onChange(value)}
          defaultValue={field.value || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
};

export default SelectField;

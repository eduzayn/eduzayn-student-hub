
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";

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
    <FormField form={form} name={name} label={label} className={className}>
      {({ value, onChange }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "pl-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              {value ? (
                format(value, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                "Selecione uma data"
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              disabled={(date) => date < new Date("1900-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </FormField>
  );
};

export default DatePickerField;

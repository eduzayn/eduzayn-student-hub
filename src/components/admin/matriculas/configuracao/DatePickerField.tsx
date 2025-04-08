
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
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
      {field => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
              ) : (
                "Selecione uma data"
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date) => field.onChange(date)}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      )}
    </FormField>
  );
};

export default DatePickerField;

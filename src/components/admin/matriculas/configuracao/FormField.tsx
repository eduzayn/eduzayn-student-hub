
import React from "react";
import {
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";

interface FormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  children: React.ReactNode | ((field: ControllerRenderProps) => React.ReactNode);
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  form,
  name,
  label,
  children,
  className
}) => {
  return (
    <UIFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {typeof children === 'function' 
              ? children(field)
              : React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement, { ...field })
                : children}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;

import { FormTextAreaProps } from "@/interfaces/form-textarea";
import { useFormContext } from "react-hook-form";



const FormTextArea = ({ name, placeholder, rows = 8 }: FormTextAreaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <fieldset className="form-group">
      <textarea
        {...register(name, { required: `${name} is required` })}
        className="form-control"
        rows={rows}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="text-danger">{String(errors[name]?.message)}</p>
      )}
    </fieldset>
  );
};

export default FormTextArea;

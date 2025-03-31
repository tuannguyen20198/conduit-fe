import { FormInputProps } from "@/interfaces/form-input";
import { useFormContext } from "react-hook-form";



const FormTextArea = ({ name, placeholder, rows }: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <fieldset className="form-group">
      <textarea
        {...register(name, { required: `${name} is required` })}
        // className="form-control"
        rows={100}
        style={{ height: "600px !important", width: "100% !important", minHeight: "500px !important" }} 
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="text-danger">{String(errors[name]?.message)}</p>
      )}
    </fieldset>
  );
};

export default FormTextArea;

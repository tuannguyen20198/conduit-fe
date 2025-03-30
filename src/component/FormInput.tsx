import { FormInputProps } from "@/interfaces/form-input";
import { useFormContext } from "react-hook-form";

const FormInput = ({ name, placeholder, type = "text" }: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <fieldset className="form-group">
      {type === "textarea" ? (
        <textarea {...register(name, { required: `${name} is required` })} className="form-control" placeholder={placeholder} />
      ) : (
        <input {...register(name, { required: `${name} is required` })} type={type} className="form-control" placeholder={placeholder} />
      )}
      {errors[name] && <p className="text-danger">{String(errors[name]?.message)}</p>}
    </fieldset>
  );
};
export default FormInput;
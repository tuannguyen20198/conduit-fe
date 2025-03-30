import { FormProvider, useForm } from "react-hook-form";
import FormInput from "./FormInput";
import FormTags from "./FormTags";
import SubmitButton from "./SubmitButton";

const ArticleForm = ({ onSubmit, apiErrors }: any) => {
  const methods = useForm({ mode: "onChange" }); // Cập nhật mode để `isValid` hoạt động đúng
  const { handleSubmit, setValue, formState: { errors } } = methods;

  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {apiErrors.length > 0 && (
          <ul className="error-messages">
            {apiErrors.map((err: any, index: number) => (
              <li key={index} className="text-danger">{err}</li>
            ))}
          </ul>
        )}

        <FormInput name="title" placeholder="Article Title" />
        <FormInput name="description" placeholder="What's this article about?" />
        <FormInput name="body" placeholder="Write your article (in markdown)" type="textarea" />

        <fieldset className="form-group">
          <FormTags onTagsChange={handleTagsChange} setError={methods.setError} clearErrors={methods.clearErrors} />
          {errors.tags && <p className="text-danger">{String(errors.tags.message)}</p>}
        </fieldset>

        <SubmitButton label="Publish Article" />
      </form>
    </FormProvider>
  );
};

export default ArticleForm;

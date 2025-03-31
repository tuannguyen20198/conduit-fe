import { useFormContext } from "react-hook-form";
import { lazy, Suspense } from "react";
import "@mdxeditor/editor/style.css";
import {
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  InsertCodeBlock,
  ListsToggle,
  UndoRedo,
  headingsPlugin,
} from "@mdxeditor/editor";

const MDXEditor = lazy(() => import("@mdxeditor/editor").then(mod => ({ default: mod.MDXEditor })));

interface FormInputProps {
  name: string;
  placeholder?: string;
  type?: "text" | "textarea" | "markdown";
}

const FormInput = ({ name, placeholder, type = "text" }: FormInputProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) ?? "";

  return (
    <fieldset className="form-group w-full max-w-4xl mx-auto"> {/* Canh giữa và giới hạn max width */}
      {type === "markdown" ? (
        <Suspense fallback={<p>Loading editor...</p>}>
          <div className="relative form-control p-3 min-h-[300px] bg-white rounded border border-gray-300 w-full"> 
            <MDXEditor
              markdown={value}
              onChange={(val) => setValue(name, val || "")}
              plugins={[
                headingsPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <BlockTypeSelect />
                      <InsertCodeBlock />
                      <ListsToggle />
                    </>
                  ),
                }),
              ]}
              className="p-2 w-full bg-transparent outline-none relative z-20"
            />
            {/* Placeholder luôn hiển thị dưới thanh toolbar */}
            {!value && (
              <div className="absolute top-20 left-10 text-gray-400 pointer-events-none z-10">
                {placeholder}
              </div>
            )}
          </div>
        </Suspense>
      ) : type === "textarea" ? (
        <textarea
          {...register(name, { required: `${name} is required` })}
          className="form-control w-full"
          placeholder={placeholder}
        />
      ) : (
        <input
          {...register(name, { required: `${name} is required` })}
          type={type}
          className="form-control w-full"
          placeholder={placeholder}
        />
      )}
      {errors[name] && <p className="text-danger">{String(errors[name]?.message)}</p>}
    </fieldset>
  );
};

export default FormInput;
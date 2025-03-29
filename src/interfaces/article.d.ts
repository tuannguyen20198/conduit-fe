interface ArticleFormData {
  title: string;
  description: string;
  body: string;
}

interface ArticleFormProps {
  handleSubmit: UseFormHandleSubmit<ArticleFormData>;
  register: UseFormRegister<ArticleFormData>;
  onSubmit: (data: ArticleFormData) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  mutation: {
    isPending: boolean;
  };
}
export type AritcleProps = AritcleFromProps;

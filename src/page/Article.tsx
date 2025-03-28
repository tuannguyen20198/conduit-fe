import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createArticle } from "@/lib/api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Article = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (articleData: {
      title: string;
      description: string;
      body: string;
      tagList: string[];
    }) => createArticle(articleData),
    onSuccess: () => {
      alert("Bài viết đã được đăng!");
      reset();
      navigate("/");
      setTags([]);
    },
    onError: (error: any) => {
      try {
        const parsedErrors = JSON.parse(error.message) as Record<string, string[]>;
        setErrorMessages(Object.values(parsedErrors).flat());
      } catch {
        setErrorMessages(["Có lỗi xảy ra, vui lòng thử lại."]);
      }
    },
  });

  const onSubmit = (data: any) => {
    const articleData = {
      title: data.title,
      description: data.description,
      body: data.body,
      tagList: tags,
    };
    mutation.mutate(articleData);
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errorMessages.length > 0 && (
              <ul className="error-messages">
                {errorMessages.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    {...register("title", { required: true })}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    {...register("description", { required: true })}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    {...register("body", { required: true })}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags (comma separated)"
                    onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
                  />
                  <div className="tag-list">
                    {tags.map((tag, index) => (
                      <span key={index} className="tag-default tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Publishing..." : "Publish Article"}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
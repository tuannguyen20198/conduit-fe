import { useState } from "react";
import axios from "axios";
import ArticleForm from "@/component/ArticleForm";

const Article = () => {
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  const onSubmit = async (data: any) => {
    setApiErrors([]); // Xóa lỗi trước đó

    try {
      const response = await axios.post("/api/articles", {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tags ? data.tags.split(",").map((tag: string) => tag.trim()) : [],
      });

      if (response.status === 200) {
        alert("Article published successfully!");
      }
    } catch (error: any) {
      console.error("Error:", error);

      if (error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message)
          ? error.response.data.message.map((msg: any) => Object.values(msg.constraints || {}).join(", "))
          : [error.response.data.message];

        setApiErrors(messages);
      } else {
        setApiErrors(["Failed to publish article."]);
      }
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ArticleForm onSubmit={onSubmit} apiErrors={apiErrors} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;

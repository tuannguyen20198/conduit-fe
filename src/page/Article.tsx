import { useState } from "react";
import axios from "axios";
import ArticleForm from "@/component/ArticleForm";
import api from "@/lib/axiosConfig";

const Article = () => {
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  const onSubmit = async (data: any) => {
    setApiErrors([]);

    try {
      const response = await api.post("/articles", {
        article:{
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: data.tags || [], // Đảm bảo tagList luôn có giá trị
        }
      });
      
      if (response.status === 200) {
        alert("Article published successfully!");
        console.log(response.data);
      }
    } catch (error: any) {
      console.error("Error:", error);
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

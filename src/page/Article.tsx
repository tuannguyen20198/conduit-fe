import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createArticle } from "@/lib/api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useArticles from "@/hook/useArticles";
import ArticleForm from "@/component/ArticleForm";

const Article = () => {
  const { errorMessages, handleSubmit, register, onSubmit, tags, setTags, mutation } = useArticles();

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
            <ArticleForm 
              handleSubmit={handleSubmit}
              register={register}
              onSubmit={onSubmit}
              tags={tags}
              setTags={setTags}
              mutation={mutation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
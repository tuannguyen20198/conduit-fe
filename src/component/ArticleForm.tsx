import useArticles from '@/hook/useArticles'
import { AritcleProps } from '@/interfaces/article'
import React from 'react'

const ArticleForm: React.FC<AritcleProps> = ({handleSubmit, register, onSubmit, tags, setTags, mutation}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <fieldset>
      <fieldset className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Article title"
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
          {tags.map((tag:any, index:any) => (
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
  )
}

export default ArticleForm
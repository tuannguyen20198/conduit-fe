import { useEffect, useState } from "react";

const FormTags = ({ onTagsChange, setError, clearErrors, defaultTags }: FormTagsProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Update tags when component mounts or when defaultTags changes
  useEffect(() => {
    if (defaultTags && defaultTags.length > 0) {
      setTags(defaultTags);
    }
  }, [defaultTags]);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault(); // Prevent form submit

      if (tags.includes(inputValue.trim())) {
        setError("tags", { type: "duplicate", message: "Tag already exists." });
        return;
      }

      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      onTagsChange(newTags);
      clearErrors("tags"); // ✅ Clear error if any
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onTagsChange(newTags);

    if (newTags.length === 0) {
      setError("tags", { type: "required", message: "Tags is required" }); // ✅ Set error if no tags left
    }
  };

  useEffect(() => {
    if (tags.length === 0) {
      setError("tags", { type: "required", message: "Tags is required" }); // ✅ Set error if no tags left
    } else {
      clearErrors("tags"); // ✅ Clear error if tags are present
    }
  }, [tags, setError, clearErrors]);

  return (
    <div className="form-group">
      <label>Tags</label>
  
      {/* Input to enter tags */}
      <input
        type="text"
        className="form-control"
        placeholder="Enter tags and press Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={addTag}
      />
  
      {/* Tags list below the input */}
      {tags.length > 0 && (
        <div className="tag-list" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px", alignItems: "center" }}>
          {tags.map((tag, index) => (
            <span key={index} className="tag-default tag-pill">
              {tag}{" "}
              <i
                className="ion-close-round"
                onClick={() => removeTag(index)}
                style={{ cursor: "pointer", marginLeft: "5px" }}
              ></i>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormTags;

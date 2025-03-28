import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "@/lib/api";

const Settings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    image: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  });

  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Đồng bộ dữ liệu từ `user` vào `formData`
  useEffect(() => {
    if (user) {
      setFormData({
        image: user.image || "",
        username: user.username || "",
        bio: user.bio || "",
        email: user.email || "",
        password: "",
      });
      setIsChanged(false);
    }
  }, [user]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Kiểm tra nếu dữ liệu khác ban đầu thì bật cờ `isChanged`
      setIsChanged(
        updatedData.image !== user?.image ||
        updatedData.username !== user?.username ||
        updatedData.bio !== user?.bio ||
        updatedData.email !== user?.email ||
        (updatedData.password !== "") // Chỉ cần kiểm tra khác rỗng
      );

      return updatedData;
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isChanged) return; // Không submit nếu dữ liệu không thay đổi

    const { password, ...updatedUserData } = formData;
    const finalData = password ? { ...updatedUserData, password } : updatedUserData;

    try {
      const updatedUser = await updateUser(finalData);
      setUser(updatedUser);
      setIsChanged(false); // Reset trạng thái sau khi cập nhật thành công
    } catch (error) {
      setError("Update failed. Please try again.");
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="settings-page">
      <div className="container page">
        <h1>Your Settings</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <fieldset className="form-group">
              <input
                className="form-control"
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="URL of profile picture"
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset className="form-group">
              <textarea
                className="form-control form-control-lg"
                rows={8}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Short bio about you"
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password (leave blank if not changing)"
              />
            </fieldset>
            <button
              className="btn btn-lg btn-primary pull-xs-right"
              type="submit"
              disabled={!isChanged} // Disable nếu không có thay đổi
            >
              Update Settings
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    image: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  });

  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Đồng bộ dữ liệu user vào form
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
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      
      // Xác định nếu có sự thay đổi
      setIsChanged(
        updatedData.image !== user?.image ||
        updatedData.username !== user?.username ||
        updatedData.bio !== user?.bio ||
        updatedData.email !== user?.email ||
        updatedData.password !== "" // Nếu có nhập password
      );

      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!isChanged) return;
  
    const { password, ...updatedUserData } = formData;
    const finalData = password ? { ...updatedUserData, password } : updatedUserData;
  
    try {
      const response = await updateUser(finalData);
      console.log("✅ API Response:", response); // Debug API
  
      if (!response?.user) {
        setError("Update failed: Invalid response.");
        return;
      }
  
      // 🔥 Cập nhật state với dữ liệu bên trong `user`
      setUser((prev) => ({ ...prev, ...response.user })); 
      console.log("🚀 Updated User State:", response.user);
  
      setIsChanged(false);
  
      if (password) {
        logout();
        navigate("/login");
      } else {
        navigate("/settings"); // Reload lại UI
      }
    } catch (error) {
      console.error("❌ Update failed:",error);
      setError("Update failed. Please try again.");
    }
  };
  

// 🟢 Khi user thay đổi, cập nhật lại formData
useEffect(() => {
  if (user) {
    console.log(user)
    setFormData({
      image: user.image || "",
      username: user.username || "",
      bio: user.bio || "",
      email: user.email || "",
      password: "",
    });
  }
}, [user]); // 🔄 Theo dõi `user`

  
  
  

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
                type="email"
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
              disabled={!isChanged}
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

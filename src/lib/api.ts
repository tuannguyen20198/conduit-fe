import api from "./axiosConfig";

const handleAPIError = (error: any) => {
  if (error.response) {
    throw new Error(
      error.response.data.errors
        ? JSON.stringify(error.response.data.errors)
        : "API Error"
    );
  } else {
    throw new Error(error.message);
  }
};

// ✅ Đăng ký (Register)
export const registerUser = async (user: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const { data } = await api.post("/users", { user });
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Đăng nhập (Login)
export const loginUser = async (user: { email: string; password: string }) => {
  try {
    const { data } = await api.post("/users/login", { user });
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/user");
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Cập nhật thông tin người dùng
export const updateUser = async (
  userData: Partial<{
    email: string;
    username: string;
    bio: string;
    image: string;
  }>
) => {
  try {
    const { data } = await api.put("/user", { user: userData });
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Lấy danh sách bài viết
export const getArticles = (params: {
  tag?: string;
  author?: string;
  limit?: number;
  offset?: number;
}) => {
  // Gửi request đến API với các tham số sử dụng axios
  return api
    .get("/articles", { params }) // Gửi GET request với đối tượng params
    .then((response) => response.data); // Trả về dữ liệu từ response
};

// ✅ Lấy thông tin bài viết theo slug
export const getArticle = async (slug: string) => {
  try {
    const { data } = await api.get(`/articles/${slug}`);
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Các API khác (theo dõi user, thêm bài viết, xóa bài viết, v.v.) vẫn giữ nguyên...
export const getTags = async () => {
  try {
    const { data } = await api.get("/tags");
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

export const getArticleBySlug = async (slug: string) => {
  try {
    const { data } = await api.get(`/articles/${slug}`);
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

export const createArticle = async (article: {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}) => {
  try {
    const { data } = await api.post("/articles", { article });
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      register(user); //  Cập nhật context ngay khi đăng ký thành công
      navigate("/");
    },
    onError: (error: any) => {
        if (error.response?.data?.errors) {
          const errorsObj = error.response.data.errors;
          setErrors(Object.values(errorsObj).flat() as string[]);
        } else {
          setErrors(["Đăng ký thất bại, vui lòng thử lại!"]);
        }
      },      
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    mutate(form);
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="/login">Have an account?</a>
            </p>

            {/* Hiển thị lỗi từ API */}
            {errors.length > 0 && (
              <ul className="error-messages">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right" disabled={isPending}>
                {isPending ? "Signing up..." : "Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import FormInput from "@/component/FormInput";
import SubmitButton from "@/component/SubmitButton";
import { useAuth } from "@/context/AuthContext";
import useLogin from "@/hook/useLogin";
import { loginUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user } = useAuth();
  const methods = useForm();
  
  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      login(user);
      navigate("/", { replace: true });
    },
    onError: (err) => {
      console.error("Error during login:", err);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    mutate(formData);
  };

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect if already logged in
    }
  }, [user, navigate]);

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="/register">Need an account?</a>
            </p>

            {error && (
              <ul className="error-messages">
                <li>{(error as any).response?.data?.errors?.["email or password"] || "Invalid credentials"}</li>
              </ul>
            )}

            <FormProvider {...methods}>
              <form onSubmit={handleLogin}>
                <fieldset className="form-group">
                  <FormInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}  // This will now handle both input and textarea events
                  />
                </fieldset>
                <fieldset className="form-group">
                  <FormInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}  // This will now handle both input and textarea events
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" disabled={isPending}>
                  {isPending ? <SubmitButton label="Sign in..."/>: <SubmitButton label="Sign in"/>}
                </button>
                
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

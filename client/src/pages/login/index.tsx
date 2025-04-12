import AuthForm from "../../components/authForm";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (
    email: string,
    password: string,
    role: "fermer" | "konsumator"
  ) => {
    login(role, email);
    navigate(role === "fermer" ? "/dashboard" : "/products");
  };

  return <AuthForm title="Login" onSubmit={handleLogin} />;
};

export default Login;

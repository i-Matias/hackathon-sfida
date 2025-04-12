import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import AuthForm from "../../components/authForm";

const Signup = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSignup = (email: string, password: string) => {
    // fake sign-up logic
    login();
    navigate("/dashboard");
  };

  return <AuthForm title="Sign Up" onSubmit={handleSignup} />;
};

export default Signup;

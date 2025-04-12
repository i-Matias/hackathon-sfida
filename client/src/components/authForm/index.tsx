import { useState } from "react";

interface Props {
  onSubmit: (
    email: string,
    password: string,
    role: "fermer" | "konsumator"
  ) => void;
  title: string;
}

const AuthForm = ({ onSubmit, title }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"fermer" | "konsumator">("konsumator");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, role);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{title}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Fjalëkalimi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "fermer" | "konsumator")}
        >
          <option value="konsumator">Konsumator</option>
          <option value="fermer">Fermer</option>
        </select>
        <button type="submit">{title}</button>
      </form>
    </div>
  );
};

export default AuthForm;

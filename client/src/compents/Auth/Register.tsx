import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UsersCotext";
import { useErrorContext } from "../../contexts/ErrorContext";

export default function Login() {
  const navigate = useNavigate();
  const { register } = useUserContext();
  const { addError } = useErrorContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register(name, email, password, confirmPassword);
      navigate("/"); 
    } catch (err) {
      addError("Registration failed"); 
    }
  };

  return (
    <div className="w-40 h-50 m-auto bg-white shadow border-radius-medium flex p-4">
      <div className="flex flex-col flex-1 items-center flex-between w-100">
        <span className="h1 text-bold mt-3">Welcome!</span>

        <div className="w-100">
          <div className="input w-100 flex items-center mb-4">
            <i className="fa fa-user" />
            <input
              type="text"
              placeholder="Full Name"
              className="flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input w-100 flex items-center mb-4">
            <i className="fa fa-envelope" />
            <input
              type="email"
              placeholder="Email"
              className="flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input w-100 flex items-center">
            <i className="fa fa-key" />
            <input
              type="password"
              placeholder="Password"
              className="flex-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input w-100 flex items-center mt-4">
            <i className="fa fa-key" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="flex-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-100 mt-4" onClick={handleRegister}>
            Register
          </button>
        </div>

        <div className="flex flex-col mt-4 mb-2">
          <span>
            Already have an account?{" "}
            <span className="link color-primary" onClick={() => navigate("/")}>
              Sign in
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Error from "../components/Error";
import { login } from "../services/auth/Authorization";
import { Checkbox } from "primereact/checkbox"; // Agregar importación del Checkbox

export const Login = ({ mostrarError, error, setToken }) => {
  // State
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");
    const storedRememberMe = localStorage.getItem("rememberMe");
    if (storedRememberMe) {
      setUsuario((prevState) => ({ ...prevState, email: storedEmail, password:  storedPassword}));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.checked);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { token },
      } = await login(usuario.email, usuario.password);
      setToken(token);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", usuario.email);
        localStorage.setItem("rememberedPassword", usuario.password);
        localStorage.setItem("rememberMe", true);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberMe");
      }
    } catch (error) {
      mostrarError(error.response.data.message);
    }
  };

  // Render
  return (
    <div className="login-body">
      <div className="flex align-self-center align-items-center justify-content-center h-screen flex-wrap">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
          <div className="text-center mb-5">
            <img
              src="assets/demo/images/blocks/logos/hyper.svg"
              alt="hyper"
              height="50"
              className="mb-3"
            />
            <div className="text-900 text-3xl font-medium mb-3">Log In</div>
            {/* <span className="text-600 font-medium line-height-3">
                Don't have an account?
              </span> */}
            {/* <button className="p-link font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                Create today!
              </button> */}
          </div>

          <form onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email1"
                className="block text-900 font-medium mb-2"
              >
                Email
              </label>
              <InputText
                id="email1"
                type="text"
                className="w-full mb-3"
                name="email"
                onChange={handleInputChange}
                value={usuario.email || ""}
                required
              />

              <label
                htmlFor="password1"
                className="block text-900 font-medium mb-2"
              >
                Password
              </label>
              <InputText
                id="password1"
                type="password"
                className="w-full mb-3"
                name="password"
                max="150"
                onChange={handleInputChange}
                value={usuario.password || ""}
                required
              />

              <div className="flex align-items-center justify-content-between mb-6">
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="rememberme1"
                    className="mr-2"
                    onChange={handleRememberMeChange}
                    checked={rememberMe}
                  />
                  <label htmlFor="rememberme1">Remember me</label>
                </div>
                {/* <button className="p-link font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                    Forgot password?
                  </button> */}
              </div>

              <Button
                label="Sign In"
                icon="pi pi-user"
                className="w-full"
                type="submit"
              />
            </div>
          </form>
          <div className="login-input-wrapper">
            <Error mensaje={error} />
          </div>
        </div>
      </div>
    </div>
  );
};

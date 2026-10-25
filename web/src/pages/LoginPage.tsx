import { KeyboardEvent, useState } from "react";
import authApi from "../api/authApi";
import LoginResponse from "../interfaces/LoginResponse";
import { useAtom, useSetAtom } from "jotai";
import { atoms } from "../atoms/atoms";
import { getEmailValidationMessage } from "../utils/emailValidator";
import { useAlert } from "../hooks/useModal";
import Alert from "../components/Alert";

const Logging = () => (
  <button className="btn btn-primary w-full" disabled>
    <span className="loading loading-spinner"></span>
    登录中
  </button>
);

const LoginPage = () => {
  const [email, setEmail] = useAtom(atoms.email);
  const setToken = useSetAtom(atoms.token);

  const [password, setPassword] = useState("");
  const [logging, setLogging] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { alertOpen, alertConfig, showAlert, hideAlert } = useAlert();

  const handleLoginClick = () => {
    const emailValidationMessage = getEmailValidationMessage(email);
    if (emailValidationMessage) {
      setEmailError(emailValidationMessage);
      return;
    }

    if (email.length <= 0 || password.length <= 0) {
      showAlert({
        message: "邮箱和密码不能为空",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    const postData = {
      email,
      password,
    };
    setLogging(true);
    authApi
      .login(postData)
      .then((response) => {
        if (!response.success) {
          showAlert({
            message: response.message,
            type: "error",
            duration: 3000,
          });
          return;
        }
        handleLoginSuccess(response.data);
      })
      .catch((error) => {
        console.error("登录请求失败", error);
        showAlert({
          message: "登录失败",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        setLogging(false);
      });
  };

  const handleLoginSuccess = (loginResponse: LoginResponse) => {
    setEmail(loginResponse.email);
    setToken(loginResponse.token);
    localStorage.setItem("email", loginResponse.email);
    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("expiresAt", String(loginResponse.expiresAt));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.trim().length > 0) {
      const validationMessage = getEmailValidationMessage(value);
      setEmailError(validationMessage);
    } else {
      setEmailError("");
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLoginClick();
    }
  };

  return (
    <>
      <div className="hero h-screen bg-base-200 overflow-hidden">
        <div className="hero-content flex-col lg:flex-row-reverse h-full">
          <div className="text-center lg:text-left shrink-0">
            <h1 className="text-5xl font-bold">My Flomo</h1>
            <p className="py-6">自托管想法记录与回顾工具</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <h2 className="card-title">账户登录</h2>
              <p className="text-sm text-base-content/60 mb-4">邮箱未注册时自动创建账户</p>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">邮箱</span>
                </label>
                <input
                  type="email"
                  placeholder="请输入邮箱"
                  className={`input input-bordered ${emailError ? "input-error" : ""}`}
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
                {emailError && (
                  <label className="label">
                    <span className="label-text-alt text-error">{emailError}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">密码</span>
                </label>
                <input
                  type="password"
                  placeholder="请输入密码"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handleKeyUp}
                />
              </div>

              <div className="form-control mt-6">
                {logging ? (
                  <Logging />
                ) : (
                  <button className="btn btn-primary w-full" onClick={handleLoginClick}>
                    登录
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Alert
        isOpen={alertOpen}
        onClose={hideAlert}
        message={alertConfig.message}
        type={alertConfig.type}
        duration={alertConfig.duration}
      />
    </>
  );
};

export default LoginPage;

import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import memoApi from "./api/memoApi";
import HomePage from "./pages/HomePage";
import { useAtomValue, useSetAtom } from "jotai";
import { atoms } from "./atoms/atoms";

function App() {
  const token = useAtomValue(atoms.token);
  const setMemoList = useSetAtom(atoms.memoList);
  const setEmail = useSetAtom(atoms.email);
  const setToken = useSetAtom(atoms.token);

  const navigate = useNavigate();

  const logout = () => {
    setEmail("");
    setToken("");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
  };

  const fetchMemoList = () => {
    return memoApi
      .list()
      .then((response) => {
        if (response.success) {
          setMemoList(response.data);
        }
      })
      .catch(() => {
        // 令牌失效时由请求层跳转登录页
      });
  };

  useEffect(() => {
    if (token) {
      fetchMemoList().then(() => navigate("/home"));
    } else {
      navigate("/login");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {token && <Header logout={logout} />}

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {token && (
            <Route
              path="/home"
              element={<HomePage fetchMemoList={fetchMemoList} logout={logout} />}
            />
          )}

          <Route
            path="*"
            element={
              <div className="hero min-h-screen">
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <h1 className="text-5xl font-bold">404</h1>
                    <p className="py-6">页面未找到</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(token ? "/home" : "/login")}
                    >
                      返回首页
                    </button>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {token && <Footer />}
    </div>
  );
}

export default App;

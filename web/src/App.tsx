import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { atoms } from "@/atoms/atoms";
import memoApi from "@/api/memoApi";
import NotFoundPage from "@/pages/NotFoundPage";
import { Toaster } from "@/components/ui/sonner";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));

const PageFallback = () => (
  <div className="grid min-h-dvh place-items-center">
    <Loader2 className="size-5 animate-spin text-muted-foreground" />
    <span className="sr-only">加载中</span>
  </div>
);

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

  const refreshMemos = () =>
    memoApi
      .list()
      .then((response) => {
        if (response.success) {
          setMemoList(response.data);
        }
      })
      .catch(() => {
        // 令牌失效时由请求层跳转登录页
      });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    refreshMemos().then(() => {
      if (window.location.pathname === "/" || window.location.pathname === "/login") {
        navigate("/home");
      }
    });
  }, [token]);

  return (
    <>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {token && (
            <Route
              path="/home"
              element={<HomePage refreshMemos={refreshMemos} logout={logout} />}
            />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" offset={{ top: 68 }} richColors closeButton />
    </>
  );
}

export default App;

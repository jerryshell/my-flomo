import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { Eye, EyeOff, Loader2, NotebookPen, ShieldCheck, Timer } from "lucide-react";
import { toast } from "sonner";
import authApi from "@/api/authApi";
import { atoms } from "@/atoms/atoms";
import ThemeMenu from "@/components/ThemeMenu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEmailValidationMessage } from "@/utils/emailValidator";
import logo from "@/favicon.svg";

const LoginPage = () => {
  const [email, setEmail] = useAtom(atoms.email);
  const setToken = useSetAtom(atoms.token);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logging, setLogging] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const validate = () => {
    const next = {
      email: getEmailValidationMessage(email) || undefined,
      password: password ? undefined : "请输入密码",
    };
    setErrors(next);
    if (next.email) {
      emailInput.current?.focus();
    } else if (next.password) {
      passwordInput.current?.focus();
    }
    return !next.email && !next.password;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setLogging(true);
    try {
      const response = await authApi.login({ email: email.trim(), password });
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      const login = response.data;
      localStorage.setItem("email", login.email);
      localStorage.setItem("token", login.token);
      localStorage.setItem("expiresAt", String(login.expiresAt));
      setEmail(login.email);
      setToken(login.token);
    } catch {
      toast.error("登录失败，请稍后重试");
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="min-h-dvh bg-muted/40">
      <div className="mx-auto grid min-h-dvh max-w-6xl lg:grid-cols-2">
        <aside className="hidden flex-col justify-between border-r bg-card p-10 lg:flex">
          <div className="flex items-center gap-2 font-heading text-sm font-semibold">
            <img src={logo} alt="" className="size-7" />
            <span>My Flomo</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-balance font-heading text-4xl font-semibold leading-tight">
                把想法留在自己的服务器上。
              </h1>
              <p className="max-w-sm text-pretty text-muted-foreground">
                记录、检索与回顾。数据保存在本机的 SQLite 文件中。
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-4 text-primary" />
                单端口部署，数据不离开服务器
              </li>
              <li className="flex items-center gap-3">
                <NotebookPen className="size-4 text-primary" />
                支持 Flomo 导入与 CSV 交换
              </li>
              <li className="flex items-center gap-3">
                <Timer className="size-4 text-primary" />
                每日邮件或 Telegram 回顾
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">MIT License</p>
        </aside>

        <main className="flex flex-col px-4 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="flex items-center gap-2 font-heading text-sm font-semibold lg:invisible"
            >
              <img src={logo} alt="" className="size-7" />
              <span>My Flomo</span>
            </Link>
            <ThemeMenu />
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-2 lg:hidden">
                <h1 className="text-balance font-heading text-2xl font-semibold leading-tight">
                  把想法留在自己的服务器上。
                </h1>
                <p className="text-pretty text-sm text-muted-foreground">
                  记录、检索与回顾，数据保存在本机。
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">登录</CardTitle>
                  <CardDescription>邮箱未注册时会自动创建账户</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        ref={emailInput}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setErrors((current) => ({ ...current, email: undefined }));
                        }}
                        onBlur={() => {
                          setErrors((current) => ({
                            ...current,
                            email: getEmailValidationMessage(email) || undefined,
                          }));
                        }}
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="text-sm text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">密码</Label>
                      <div className="relative">
                        <Input
                          ref={passwordInput}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          placeholder="请输入密码"
                          className="pr-10"
                          value={password}
                          aria-invalid={Boolean(errors.password)}
                          aria-describedby={errors.password ? "password-error" : undefined}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            setErrors((current) => ({ ...current, password: undefined }));
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute top-1/2 right-1 -translate-y-1/2"
                          onClick={() => setShowPassword((current) => !current)}
                          aria-label={showPassword ? "隐藏密码" : "显示密码"}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p id="password-error" role="alert" className="text-sm text-destructive">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={logging}>
                      {logging && <Loader2 className="animate-spin" />}
                      {logging ? "登录中" : "登录"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;

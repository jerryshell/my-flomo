import { FormEvent, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { atoms } from "@/atoms/atoms";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import userApi from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PasswordForm = () => {
  const email = useAtomValue(atoms.email);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmation?: string }>({});
  const [saving, setSaving] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);
  const confirmationInput = useRef<HTMLInputElement>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = {
      password:
        password.length === 0
          ? "请输入新密码"
          : password.length < 6
            ? "密码长度不能少于 6 位"
            : undefined,
      confirmation: confirmation !== password ? "两次输入的密码不一致" : undefined,
    };
    setErrors(next);
    if (next.password) {
      passwordInput.current?.focus();
    } else if (next.confirmation) {
      confirmationInput.current?.focus();
    }
    if (next.password || next.confirmation) {
      return;
    }

    setSaving(true);
    try {
      const response = await userApi.updatePassword({ password });
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setPassword("");
      setConfirmation("");
      toast.success("密码已更新");
    } catch {
      toast.error("密码更新失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">修改密码</h3>
        <p className="text-xs text-muted-foreground">修改后立即生效，下次登录使用新密码。</p>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        <input
          type="email"
          name="username"
          autoComplete="username"
          value={email}
          readOnly
          className="hidden"
        />
        <div className="space-y-2">
          <Label htmlFor="new-password">新密码</Label>
          <Input
            ref={passwordInput}
            id="new-password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "new-password-error" : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
            }}
            placeholder="至少 6 位"
          />
          {errors.password && (
            <p id="new-password-error" role="alert" className="text-sm text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">确认新密码</Label>
          <Input
            ref={confirmationInput}
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmation}
            aria-invalid={Boolean(errors.confirmation)}
            aria-describedby={errors.confirmation ? "confirm-password-error" : undefined}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setErrors((current) => ({ ...current, confirmation: undefined }));
            }}
            placeholder="再次输入新密码"
          />
          {errors.confirmation && (
            <p id="confirm-password-error" role="alert" className="text-sm text-destructive">
              {errors.confirmation}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving && <Loader2 className="animate-spin" />}
          更新密码
        </Button>
      </form>
    </div>
  );
};

export default PasswordForm;

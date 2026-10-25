import { useEffect, useState } from "react";
import { BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";
import userApi from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

const ReviewForm = () => {
  const [enabled, setEnabled] = useState(false);
  const [chatId, setChatId] = useState("");
  const [botToken, setBotToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    let active = true;
    userApi
      .getSettings()
      .then((response) => {
        if (!active || !response.success) {
          return;
        }
        setEnabled(response.data.dailyReviewEnabled);
        setChatId(response.data.telegramChatId);
        setBotToken(response.data.telegramBotToken);
      })
      .catch(() => {
        if (active) {
          toast.error("读取回顾设置失败");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const response = await userApi.updateSettings({
        dailyReviewEnabled: enabled,
        telegramChatId: chatId.trim(),
        telegramBotToken: botToken.trim(),
      });
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success("回顾设置已保存");
    } catch {
      toast.error("保存失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setTesting(true);
    try {
      const response = await userApi.triggerDailyReview();
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success("回顾任务已触发");
    } catch {
      toast.error("触发失败，请稍后重试");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const telegramReady = chatId.trim() !== "" && botToken.trim() !== "";

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
        <div className="space-y-1">
          <Label htmlFor="daily-review">开启每日回顾</Label>
          <p className="text-xs text-muted-foreground">
            按服务器定时任务随机发送一条想法到邮箱或 Telegram。
          </p>
        </div>
        <Switch id="daily-review" checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="telegram-chat-id">Telegram Chat ID</Label>
          <Input
            id="telegram-chat-id"
            name="telegramChatId"
            value={chatId}
            onChange={(event) => setChatId(event.target.value)}
            placeholder="例如 123456789"
            disabled={!enabled}
          />
          <p className="text-xs text-muted-foreground">
            向{" "}
            <a
              className="underline underline-offset-4"
              href="https://t.me/userinfobot"
              target="_blank"
              rel="noreferrer"
            >
              @userinfobot
            </a>{" "}
            发送消息获取 Chat ID。
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegram-bot-token">Telegram Bot Token</Label>
          <Input
            id="telegram-bot-token"
            name="telegramBotToken"
            type="password"
            value={botToken}
            onChange={(event) => setBotToken(event.target.value)}
            placeholder="从 @BotFather 获取"
            autoComplete="off"
            disabled={!enabled}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving && <Loader2 className="animate-spin" />}
        保存回顾设置
      </Button>

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void test()}
          disabled={testing || !enabled || !telegramReady}
        >
          {testing ? <Loader2 className="animate-spin" /> : <BellRing />}
          测试回顾
        </Button>
        <p className="text-xs text-muted-foreground">
          {enabled && telegramReady
            ? "立即运行一次回顾任务。"
            : "开启回顾并填写 Telegram 配置后可测试。"}
        </p>
      </div>
    </form>
  );
};

export default ReviewForm;

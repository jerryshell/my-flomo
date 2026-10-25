import { useEffect, useState } from "react";
import { Copy, KeyRound, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiAbsoluteUrl } from "@/api/api";
import pluginApi from "@/api/pluginApi";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const Endpoint = ({
  label,
  method,
  url,
}: {
  label: string;
  method: string;
  url: string;
}) => (
  <div className="space-y-1.5 rounded-lg border bg-muted/30 p-3">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium">{label}</p>
      <Badge variant="outline" className="font-mono">
        {method}
      </Badge>
    </div>
    <div className="flex items-start gap-2">
      <code className="min-w-0 flex-1 break-all font-mono text-xs text-muted-foreground">
        {url}
      </code>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={`复制${label}地址`}
        onClick={() => void copy(url, "接口地址")}
      >
        <Copy />
      </Button>
    </div>
  </div>
);

const copy = async (value: string, label: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label}已复制`);
  } catch {
    toast.error("复制失败，请手动选择");
  }
};

const PluginPanel = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let active = true;
    pluginApi
      .getToken()
      .then((response) => {
        if (active && response.success) {
          setToken(response.data);
        }
      })
      .catch(() => {
        if (active) {
          toast.error("读取插件令牌失败");
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

  const generate = async () => {
    setGenerating(true);
    try {
      const response = await pluginApi.createToken();
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setToken(response.data);
      setConfirmOpen(false);
      toast.success("插件令牌已生成");
    } catch {
      toast.error("生成失败，请稍后重试");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <KeyRound className="size-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium">尚未生成插件令牌</h3>
          <p className="text-xs text-muted-foreground">
            令牌用于第三方应用写入想法。
          </p>
        </div>
        <Button size="sm" onClick={() => void generate()} disabled={generating}>
          {generating && <Loader2 className="animate-spin" />}
          生成令牌
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label>插件令牌</Label>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="复制插件令牌"
            onClick={() => void copy(token, "插件令牌")}
          >
            <Copy />
          </Button>
        </div>
        <code className="block break-all rounded-lg border bg-muted/40 p-3 font-mono text-xs">
          {token}
        </code>
      </div>

      <Endpoint
        label="新增想法"
        method="POST"
        url={apiAbsoluteUrl(`/plugin/createMemo/${token}`)}
      />
      <Endpoint
        label="随机回顾"
        method="GET"
        url={apiAbsoluteUrl(`/plugin/randomMemo/${token}`)}
      />

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setConfirmOpen(true)}
          disabled={generating}
        >
          <RefreshCw />
          重新生成令牌
        </Button>
        <p className="text-xs text-muted-foreground">重新生成后，旧令牌与地址立即失效。</p>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="重新生成插件令牌？"
        description="旧令牌与已配置的第三方地址将立即失效。"
        confirmLabel="重新生成"
        pending={generating}
        onConfirm={() => void generate()}
      />
    </div>
  );
};

export default PluginPanel;

import { useState } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { HealthData } from "@/interfaces/HealthData";
import { cn } from "@/lib/utils";

const formatUptime = (raw: string) => {
  const match = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?([\d.]+)s$/);
  if (!match) {
    return raw;
  }
  const [, hour, minute, second] = match;
  const parts: string[] = [];
  if (hour) {
    parts.push(`${hour} 小时`);
  }
  if (minute) {
    parts.push(`${minute} 分`);
  }
  if (second) {
    parts.push(`${Math.floor(Number(second))} 秒`);
  }
  return parts.join(" ");
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(1)} ${units[index]}`;
};

const Row = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="truncate font-mono tabular-nums">{value}</dd>
  </div>
);

const ServerDetails = ({ data }: { data: HealthData }) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between px-0 text-muted-foreground"
        >
          运行详情
          <ChevronDown />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Separator className="mb-3" />
        <dl className="grid gap-2 text-xs">
          <Row label="构建模式" value={data.version.build_mode} />
          <Row label="构建时间" value={data.version.build_time || "未知"} />
          <Row label="Go" value={data.version.go_version} />
          <Row label="系统" value={`${data.runtime.go_os}/${data.runtime.go_arch}`} />
          <Row label="协程" value={data.runtime.num_goroutine} />
          <Row label="CPU" value={data.runtime.num_cpu} />
          <Row label="内存" value={formatBytes(data.memory.alloc)} />
          <Row label="GC" value={data.memory.num_gc} />
        </dl>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ServerStatus = () => {
  const { serverStatus, healthData, refresh } = useHealthCheck();
  const online = serverStatus === "在线";
  const offline = serverStatus === "离线";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">服务器</CardTitle>
          <Badge variant={online ? "secondary" : offline ? "destructive" : "outline"}>
            <span
              className={cn(
                "size-1.5 rounded-full",
                online && "bg-emerald-500",
                offline && "bg-destructive",
                !online && !offline && "bg-muted-foreground",
              )}
            />
            {serverStatus}
          </Badge>
        </div>
        <CardDescription>状态每 30 秒刷新一次</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {healthData ? (
          <>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">运行时间</dt>
                <dd className="tabular-nums">{formatUptime(healthData.uptime)}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">版本</dt>
                <dd>
                  {healthData.version.commit ? (
                    <a
                      className="font-mono text-xs underline-offset-4 hover:underline"
                      href={`https://github.com/jerryshell/my-flomo/tree/${healthData.version.commit}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`查看提交 ${healthData.version.commit.slice(0, 7)}`}
                    >
                      {healthData.version.commit.slice(0, 7)}
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">开发模式</span>
                  )}
                </dd>
              </div>
            </dl>
            <ServerDetails data={healthData} />
          </>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {offline && (
          <Button variant="outline" size="sm" onClick={() => void refresh()}>
            <RefreshCw />
            重试
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerStatus;

import { HealthData } from "../interfaces/HealthData";

interface ServerStatusProps {
  status: string;
  healthData: HealthData | null;
  onToggleDetails: () => void;
  showDetails: boolean;
}

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

const ServerStatus = ({ status, healthData, onToggleDetails, showDetails }: ServerStatusProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "在线":
        return "text-success";
      case "离线":
        return "text-error";
      default:
        return "text-warning";
    }
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">服务器状态：</span>
        <span className={`badge badge-sm ${getStatusColor()}`}>{status}</span>
      </div>

      {healthData && (
        <>
          <div className="flex items-center gap-2">
            <span className="font-medium">运行时间：</span>
            <span className="text-xs">{formatUptime(healthData.uptime)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">版本：</span>
            {healthData.version.commit ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://github.com/jerryshell/my-flomo/tree/${healthData.version.commit}`}
                className="link link-primary text-xs"
              >
                {healthData.version.commit.substring(0, 7)}
              </a>
            ) : (
              <span className="text-xs text-warning">开发模式（无 commit 信息）</span>
            )}
          </div>

          <button className="btn btn-xs btn-ghost self-start" onClick={onToggleDetails}>
            {showDetails ? "隐藏详情" : "显示详情"}
          </button>
        </>
      )}
    </div>
  );
};

export default ServerStatus;

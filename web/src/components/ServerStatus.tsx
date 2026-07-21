import { HealthData } from "../interfaces/HealthData";

interface ServerStatusProps {
  status: string;
  healthData: HealthData | null;
  onToggleDetails: () => void;
  showDetails: boolean;
}

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
        <span className="font-medium">服务器状态:</span>
        <span className={`badge badge-sm ${getStatusColor()}`}>{status}</span>
      </div>

      {healthData && (
        <>
          <div className="flex items-center gap-2">
            <span className="font-medium">运行时间:</span>
            <span className="text-xs">{healthData.uptime}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">版本:</span>
            {healthData.version.commit ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://github.com/jerryshell/my-flomo-server/tree/${healthData.version.commit}`}
                className="link link-primary text-xs"
              >
                {healthData.version.commit.substring(0, 7)}
              </a>
            ) : (
              <span className="text-xs text-warning">开发模式 (无commit信息)</span>
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

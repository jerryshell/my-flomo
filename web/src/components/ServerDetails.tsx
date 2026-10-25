import { HealthData } from "../interfaces/HealthData";

interface ServerDetailsProps {
  healthData: HealthData;
}

const ServerDetails = ({ healthData }: ServerDetailsProps) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="card bg-base-200 shadow-inner p-3 mt-2">
      <div className="grid grid-cols-1 gap-2 text-xs">
        <div className="divider my-1">版本信息</div>
        <div className="flex justify-between">
          <span>Go 版本：</span>
          <span>{healthData.version.go_version}</span>
        </div>
        <div className="flex justify-between">
          <span>构建模式：</span>
          <span
            className={`badge badge-xs ${
              healthData.version.build_mode.includes("development")
                ? "badge-warning"
                : "badge-success"
            }`}
          >
            {healthData.version.build_mode}
          </span>
        </div>
        <div className="flex justify-between">
          <span>构建时间：</span>
          <span>{healthData.version.build_time || "未知"}</span>
        </div>

        <div className="divider my-1">运行时信息</div>
        <div className="flex justify-between">
          <span>操作系统：</span>
          <span>
            {healthData.runtime.go_os}/{healthData.runtime.go_arch}
          </span>
        </div>
        <div className="flex justify-between">
          <span>协程数：</span>
          <span>{healthData.runtime.num_goroutine}</span>
        </div>
        <div className="flex justify-between">
          <span>CPU 核心：</span>
          <span>{healthData.runtime.num_cpu}</span>
        </div>

        <div className="divider my-1">内存使用</div>
        <div className="flex justify-between">
          <span>已分配：</span>
          <span>{formatBytes(healthData.memory.alloc)}</span>
        </div>
        <div className="flex justify-between">
          <span>总分配：</span>
          <span>{formatBytes(healthData.memory.total_alloc)}</span>
        </div>
        <div className="flex justify-between">
          <span>系统内存：</span>
          <span>{formatBytes(healthData.memory.sys)}</span>
        </div>
        <div className="flex justify-between">
          <span>GC 次数：</span>
          <span>{healthData.memory.num_gc}</span>
        </div>
      </div>
    </div>
  );
};

export default ServerDetails;

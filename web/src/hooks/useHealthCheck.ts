import { useEffect, useState } from "react";
import healthApi from "../api/healthApi";
import { HealthData } from "../interfaces/HealthData";

export const useHealthCheck = () => {
  const [serverStatus, setServerStatus] = useState("检查中");
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  useEffect(() => {
    const checkHealth = () => {
      healthApi
        .health()
        .then((response) => {
          if (response.success) {
            setServerStatus("在线");
            setHealthData(response.data);
          } else {
            setServerStatus("离线");
            setHealthData(null);
          }
        })
        .catch((e) => {
          console.error("health error", e);
          setServerStatus("离线");
          setHealthData(null);
        });
    };

    checkHealth();

    // 每 30 秒轮询一次
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return { serverStatus, healthData };
};

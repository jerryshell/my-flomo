import { useCallback, useEffect, useState } from "react";
import healthApi from "@/api/healthApi";
import { HealthData } from "@/interfaces/HealthData";

export const useHealthCheck = () => {
  const [serverStatus, setServerStatus] = useState("检查中");
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  const check = useCallback(async () => {
    try {
      const response = await healthApi.health();
      if (response.success) {
        setServerStatus("在线");
        setHealthData(response.data);
      } else {
        setServerStatus("离线");
        setHealthData(null);
      }
    } catch {
      setServerStatus("离线");
      setHealthData(null);
    }
  }, []);

  useEffect(() => {
    void check();
    const interval = setInterval(() => void check(), 30000);
    return () => clearInterval(interval);
  }, [check]);

  return { serverStatus, healthData, refresh: check };
};

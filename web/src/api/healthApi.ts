import { get } from "./api";
import { HealthData } from "../interfaces/HealthData";

const healthApi = {
  health: () => {
    return get<HealthData>("/health");
  },
};

export default healthApi;

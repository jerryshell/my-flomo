import { useState } from "react";
import MemoCreate from "../components/MemoCreate";
import FlomoImport from "../components/FlomoImport";
import CsvExport from "../components/CsvExport";
import CsvImport from "../components/CsvImport";
import DangerousArea from "../components/DangerousArea";
import MemoList from "../components/MemoList";
import UserSettingsCard from "../components/UserSettingsCard";
import ServerStatus from "../components/ServerStatus";
import ServerDetails from "../components/ServerDetails";
import { useHealthCheck } from "../hooks/useHealthCheck";

interface HomePageProps {
  fetchMemoList(): void;
  logout: () => void;
}

const HomePage = (props: HomePageProps) => {
  const { serverStatus, healthData } = useHealthCheck();
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* === 左栏功能 === */}
        <div className="xl:col-span-1 space-y-6">
          <div className="card bg-base-100 shadow-lg border border-base-300/50">
            <div className="card-body p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-info rounded-full"></div>
                <h2 className="card-title text-lg font-semibold">服务器状态</h2>
              </div>
              <ServerStatus
                status={serverStatus}
                healthData={healthData}
                onToggleDetails={() => setShowDetails(!showDetails)}
                showDetails={showDetails}
              />
              {showDetails && healthData && <ServerDetails healthData={healthData} />}
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/50">
            <div className="card-body p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <h2 className="card-title text-lg font-semibold">记录想法</h2>
              </div>
              <MemoCreate fetchMemoList={props.fetchMemoList} />
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/50">
            <div className="card-body p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <h2 className="card-title text-lg font-semibold">数据管理</h2>
              </div>
              <div className="space-y-4">
                <FlomoImport fetchMemoList={props.fetchMemoList} />
                <CsvExport />
                <CsvImport fetchMemoList={props.fetchMemoList} />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/50">
            <div className="card-body p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <h2 className="card-title text-lg font-semibold">用户设置</h2>
              </div>
              <UserSettingsCard />
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border-2 border-error">
            <div className="card-body p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <h2 className="card-title text-lg font-semibold text-error">危险区域</h2>
              </div>
              <DangerousArea logout={props.logout} />
            </div>
          </div>
        </div>

        {/* === 想法列表 === */}
        <div className="xl:col-span-3">
          <div className="card bg-base-100 shadow-lg border border-base-300/50">
            <div className="card-body p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <h2 className="card-title text-xl font-semibold">我的想法</h2>
              </div>
              <MemoList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import DataCard from "@/components/data/DataCard";
import MemoComposer from "@/components/memo/MemoComposer";
import MemoList from "@/components/memo/MemoList";
import DangerZone from "@/components/settings/DangerZone";
import SettingsCard from "@/components/settings/SettingsCard";
import ServerStatus from "@/components/server/ServerStatus";

interface HomePageProps {
  refreshMemos: () => Promise<void>;
  logout: () => void;
}

const HomePage = ({ refreshMemos, logout }: HomePageProps) => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header onLogout={logout} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <h1 className="sr-only">My Flomo 想法</h1>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            <MemoComposer onCreated={refreshMemos} />
            <MemoList />
          </div>

          <aside className="space-y-6">
            <ServerStatus />
            <SettingsCard />
            <DataCard onImported={refreshMemos} />
            <DangerZone onDeleted={logout} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

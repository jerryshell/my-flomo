import { Link } from "react-router-dom";
import { LogOut, Settings2 } from "lucide-react";
import logo from "@/favicon.svg";
import { Button } from "@/components/ui/button";
import ThemeMenu from "@/components/ThemeMenu";

interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link to="/home" className="flex items-center gap-2 rounded-md font-heading text-sm font-semibold">
          <img src={logo} alt="" className="size-6" />
          <span>My Flomo</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-9 lg:hidden" asChild>
            <a href="#settings" aria-label="跳到设置">
              <Settings2 />
            </a>
          </Button>
          <ThemeMenu />
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-2.5 md:h-9"
            onClick={onLogout}
            aria-label="退出登录"
          >
            <LogOut />
            <span className="hidden sm:inline">退出登录</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

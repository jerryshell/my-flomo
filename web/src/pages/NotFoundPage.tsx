import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { atoms } from "@/atoms/atoms";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const token = useAtomValue(atoms.token);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-heading text-6xl font-semibold tabular-nums">404</p>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">页面未找到</h1>
        <p className="text-sm text-muted-foreground text-pretty">链接可能已失效。</p>
      </div>
      <Button asChild>
        <Link to={token ? "/home" : "/login"}>{token ? "返回首页" : "前往登录"}</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;

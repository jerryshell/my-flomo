import { useState } from "react";
import { toast } from "sonner";
import deleteMyAccountApi from "@/api/deleteMyAccountApi";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DangerZone = ({ onDeleted }: { onDeleted: () => void }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      const response = await deleteMyAccountApi.deleteMyAccount();
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setOpen(false);
      toast.success(response.message || "账户已注销");
      setTimeout(onDeleted, 1200);
    } catch {
      toast.error("注销失败，请稍后重试");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="ring-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">危险区域</CardTitle>
          <CardDescription>删除账户与全部想法，操作无法撤销。</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full" onClick={() => setOpen(true)}>
            注销账户
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="注销账户？"
        description="账户与全部想法将被永久删除，无法恢复。"
        confirmLabel="确认注销"
        pending={deleting}
        onConfirm={() => void remove()}
      />
    </>
  );
};

export default DangerZone;

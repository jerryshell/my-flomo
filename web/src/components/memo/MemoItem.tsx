import { useState } from "react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import memoApi from "@/api/memoApi";
import { atoms } from "@/atoms/atoms";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import Memo from "@/interfaces/Memo";

const MemoItem = ({ memo }: { memo: Memo }) => {
  const [memoList, setMemoList] = useAtom(atoms.memoList);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(memo.content);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const save = async () => {
    const value = content.trim();
    if (!value) {
      toast.error("内容不能为空");
      return;
    }
    if (value === memo.content) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const response = await memoApi.update({ id: memo.id, content: value });
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setMemoList(
        memoList.map((item) => (item.id === response.data.id ? response.data : item)),
      );
      setEditing(false);
      toast.success("已更新");
    } catch {
      toast.error("更新失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      const response = await memoApi.deleteById(memo.id);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setMemoList(memoList.filter((item) => item.id !== memo.id));
      setConfirmOpen(false);
      toast.success("已删除");
    } catch {
      toast.error("删除失败，请稍后重试");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="gap-3">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <time
            dateTime={memo.createdAt}
            className="text-xs text-muted-foreground tabular-nums"
          >
            {dayjs(memo.createdAt).format("YYYY-MM-DD HH:mm")}
          </time>

          {!editing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="想法操作">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setEditing(true)}>
                  <Pencil />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setConfirmOpen(true)}
                >
                  <Trash2 />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {editing ? (
          <div className="space-y-2">
            <Textarea
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              autoFocus
              className="min-h-28 resize-none leading-7"
              aria-label="编辑想法内容"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setContent(memo.content);
                }}
                disabled={saving}
              >
                取消
              </Button>
              <Button size="sm" onClick={() => void save()} disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                保存
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-pretty break-words whitespace-pre-wrap text-base leading-7">
            {memo.content}
          </p>
        )}
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="删除这条想法？"
        description="删除后无法恢复。"
        confirmLabel="删除"
        pending={deleting}
        onConfirm={() => void remove()}
      />
    </Card>
  );
};

export default MemoItem;

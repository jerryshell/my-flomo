import { useRef, useState } from "react";
import { Loader2, PenLine } from "lucide-react";
import { toast } from "sonner";
import memoApi from "@/api/memoApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MemoComposerProps {
  onCreated: () => Promise<void> | void;
}

const MemoComposer = ({ onCreated }: MemoComposerProps) => {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);

  const save = async () => {
    const value = content.trim();
    if (!value || saving) {
      return;
    }

    setSaving(true);
    try {
      const response = await memoApi.create({ content: value });
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setContent("");
      await onCreated();
      toast.success("已记录");
      textarea.current?.focus();
    } catch {
      toast.error("保存失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card id="composer" className="gap-3">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <PenLine className="size-4 text-primary" />
          记录想法
        </div>

        <Label htmlFor="memo-content" className="sr-only">
          想法内容
        </Label>
        <Textarea
          ref={textarea}
          id="memo-content"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              void save();
            }
          }}
          placeholder="记录此刻的想法"
          className="min-h-28 resize-none text-base leading-7"
        />

        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-xs text-muted-foreground sm:block">
            按 <kbd className="rounded border bg-muted px-1 py-0.5 font-sans text-xs">Ctrl</kbd>{" "}
            +{" "}
            <kbd className="rounded border bg-muted px-1 py-0.5 font-sans text-xs">Enter</kbd>{" "}
            保存
          </p>
          <Button
            className="ml-auto"
            onClick={() => void save()}
            disabled={!content.trim() || saving}
          >
            {saving && <Loader2 className="animate-spin" />}
            {saving ? "保存中" : "保存"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoComposer;

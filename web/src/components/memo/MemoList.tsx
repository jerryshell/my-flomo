import { useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { NotebookPen, SearchX } from "lucide-react";
import { atoms } from "@/atoms/atoms";
import MemoItem from "@/components/memo/MemoItem";
import MemoSearch from "@/components/memo/MemoSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MemoList = () => {
  const memoList = useAtomValue(atoms.memoList);
  const keyword = useAtomValue(atoms.memoKeyword);
  const setKeyword = useSetAtom(atoms.memoKeyword);

  const filtered = useMemo(() => {
    const words = keyword.split(" ").filter(Boolean);
    if (words.length === 0) {
      return memoList;
    }
    return memoList.filter((memo) =>
      words.some(
        (word) =>
          memo.content.includes(word) ||
          memo.createdAt.includes(word) ||
          memo.id.includes(word),
      ),
    );
  }, [memoList, keyword]);

  const focusComposer = () => {
    document.getElementById("memo-content")?.focus();
  };

  return (
    <section className="space-y-3" aria-labelledby="memo-list-title">
      <div className="flex items-center justify-between gap-2">
        <h2 id="memo-list-title" className="font-heading text-lg font-semibold">
          我的想法
        </h2>
        <Badge variant="secondary" className="tabular-nums">
          {keyword.trim() ? `${filtered.length} / ${memoList.length}` : memoList.length}
        </Badge>
      </div>

      <MemoSearch />

      {memoList.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <NotebookPen className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">还没有想法</h3>
            <p className="text-sm text-muted-foreground">记录第一条想法，开始使用。</p>
          </div>
          <Button variant="outline" size="sm" onClick={focusComposer}>
            开始记录
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <SearchX className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">没有匹配的想法</h3>
            <p className="text-sm text-muted-foreground">换一个关键词试试。</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setKeyword("")}>
            清除搜索
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((memo) => (
            <li key={memo.id}>
              <MemoItem memo={memo} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MemoList;

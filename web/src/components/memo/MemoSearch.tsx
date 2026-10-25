import { Search, X } from "lucide-react";
import { useAtom } from "jotai";
import { atoms } from "@/atoms/atoms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MemoSearch = () => {
  const [keyword, setKeyword] = useAtom(atoms.memoKeyword);

  return (
    <div role="search" className="relative">
      <Label htmlFor="memo-search" className="sr-only">
        搜索想法
      </Label>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="memo-search"
        name="keyword"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setKeyword("");
          }
        }}
        placeholder="搜索想法，空格分隔关键词"
        className="pr-9 pl-8"
      />
      {keyword && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={() => setKeyword("")}
          aria-label="清除搜索"
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export default MemoSearch;

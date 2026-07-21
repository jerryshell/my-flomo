import MemoListItem from "./MemoListItem";
import { useRecoilValue } from "recoil";
import { atoms } from "../atoms/atoms";
import MemoKeywordFilter from "./MemoKeywordFilter";
import { useMemo } from "react";

const MemoList = () => {
  const memoList = useRecoilValue(atoms.memoList);
  const memoKeyword = useRecoilValue(atoms.memoKeyword);
  const memoShowList = useMemo(() => {
    const memoKeywordSplit = memoKeyword.split(" ").filter((item) => item.length > 0);
    if (memoKeywordSplit.length <= 0) {
      return memoList;
    }
    return memoList.filter((item) => {
      return Object.values(item).some((value) => {
        return memoKeywordSplit.some((keyword) => value && value.includes(keyword));
      });
    });
  }, [memoList, memoKeyword]);

  if (memoList.length === 0) {
    return (
      <div className="space-y-6">
        <MemoKeywordFilter />
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">还没有想法</h3>
            <p className="text-base-content/70">创建你的第一条想法开始记录吧！</p>
          </div>
        </div>
      </div>
    );
  }

  if (memoShowList.length === 0) {
    return (
      <div className="space-y-6">
        <MemoKeywordFilter />
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">没有找到匹配的想法</h3>
            <p className="text-base-content/70">尝试使用不同的关键词进行搜索</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MemoKeywordFilter />
      <div className="grid gap-4">
        {memoShowList.map((memo) => (
          <MemoListItem memo={memo} key={memo.id} />
        ))}
      </div>
    </div>
  );
};

export default MemoList;

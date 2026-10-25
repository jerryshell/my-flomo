import { useRecoilState } from "recoil";
import { atoms } from "../atoms/atoms";

const MemoKeywordFilter = () => {
  const [memoKeyword, setMemoKeyword] = useRecoilState(atoms.memoKeyword);

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300/50">
      <div className="card-body p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <h3 className="card-title text-lg font-semibold">按关键字筛选</h3>
        </div>

        <div className="form-control">
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="输入关键字"
                className="input input-bordered w-full pl-10 pr-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                value={memoKeyword}
                onChange={(e) => setMemoKeyword(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <button
              className="btn btn-outline gap-2 px-4"
              onClick={() => setMemoKeyword("")}
              disabled={!memoKeyword}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              重置
            </button>
          </div>
          <div className="text-xs text-base-content/50 mt-2">多个关键字用空格分隔</div>
        </div>

        {memoKeyword && (
          <div className="flex items-center space-x-2 text-sm text-base-content/70 mt-3 bg-primary/5 rounded-lg p-3">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>当前关键字：</span>
            <span className="font-medium text-primary">{memoKeyword}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoKeywordFilter;

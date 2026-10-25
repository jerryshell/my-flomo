import { useState } from "react";
import memoApi from "../api/memoApi";

const MemoCreate = (props: { fetchMemoList(): void }) => {
  const [newMemo, setNewMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveBtnClick = () => {
    if (!newMemo.trim()) {
      return;
    }

    setIsLoading(true);
    memoApi
      .create({
        content: newMemo,
      })
      .then((response) => {
        if (response.success) {
          props.fetchMemoList();
        }
      })
      .finally(() => {
        setNewMemo("");
        setIsLoading(false);
      });
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="记录此刻的想法"
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
        />
      </div>

      <div className="form-control">
        <button
          className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
          onClick={handleSaveBtnClick}
          disabled={!newMemo.trim() || isLoading}
        >
          {isLoading ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
};

export default MemoCreate;

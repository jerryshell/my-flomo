import { useState } from "react";
import memoApi from "../api/memoApi";
import Memo from "../interfaces/Memo";
import { useRecoilState } from "recoil";
import { atoms } from "../atoms/atoms";
import dayjs from "dayjs";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";

const MemoListItem = (props: { memo: Memo }) => {
  const [editModeFlag, setEditModeFlag] = useState(false);
  const [memo, setMemo] = useState({ ...props.memo });
  const [memoList, setMemoList] = useRecoilState(atoms.memoList);
  const [isLoading, setIsLoading] = useState(false);
  const { modalOpen, modalConfig, showModal, hideModal } = useModal();

  const handleTextareaChange = (e: { target: { value: string } }) => {
    const content = e.target.value;
    const newMemo = { ...memo, content };
    setMemo(newMemo);
  };

  const handleUpdateBtnClick = () => {
    setIsLoading(true);
    setEditModeFlag(false);
    memoApi
      .update(memo)
      .then((response) => {
        const success = response.data.success;
        if (success) {
          const memo = response.data.data;
          setMemoList(memoList.map((item) => (item.id === memo.id ? memo : item)));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleMemoDeleteBtnClick = (id: string) => {
    showModal({
      title: "确认删除",
      message: "确定要删除这条想法吗？",
      type: "warning",
      confirmText: "删除",
      cancelText: "取消",
      onConfirm: () => {
        setIsLoading(true);
        setMemoList(memoList.filter((item) => item.id !== id));
        memoApi
          .deleteById(id)
          .then((response) => {
            console.log("delete memo response", response);
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
    });
  };

  const handleCancelBtnClick = () => {
    setEditModeFlag(false);
    setMemo({ ...props.memo });
  };

  return (
    <>
      <div className="card bg-base-100 shadow-lg border border-base-300/50">
        <div className="card-body p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <h3 className="text-sm font-medium text-base-content/70">
                {dayjs(memo.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </h3>
            </div>

            <div className="flex space-x-2">
              {editModeFlag ? (
                <>
                  <button
                    className="btn btn-sm btn-success btn-outline gap-2"
                    onClick={handleUpdateBtnClick}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </>
                    )}
                    更新
                  </button>
                  <button
                    className="btn btn-sm btn-outline gap-2"
                    onClick={handleCancelBtnClick}
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    取消
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-sm btn-outline gap-2"
                  onClick={() => setEditModeFlag(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  编辑
                </button>
              )}

              <button
                className="btn btn-sm btn-error btn-outline gap-2"
                onClick={() => handleMemoDeleteBtnClick(memo.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </>
                )}
                删除
              </button>
            </div>
          </div>

          <div className="mt-4">
            {editModeFlag ? (
              <textarea
                className="textarea textarea-bordered w-full h-32 text-base leading-relaxed resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                value={memo.content}
                onChange={handleTextareaChange}
                placeholder="编辑想法内容..."
              />
            ) : (
              <p className="whitespace-pre-wrap text-base leading-relaxed text-base-content/90 bg-base-200/50 rounded-lg p-4">
                {memo.content}
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm}
        showCancel={modalConfig.showCancel}
      />
    </>
  );
};

export default MemoListItem;

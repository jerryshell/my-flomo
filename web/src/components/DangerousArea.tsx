import { useState } from "react";
import deleteMyAccountApi from "../api/deleteMyAccountApi";
import { useAlert } from "../hooks/useModal";
import Alert from "./Alert";

const DangerousArea = (props: { logout: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { alertOpen, alertConfig, showAlert, hideAlert } = useAlert();

  const deleteMyAccount = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    deleteMyAccountApi
      .deleteMyAccount()
      .then((response) => {
        if (response.success) {
          showAlert({
            message: response.message,
            type: "success",
            duration: 2000,
          });
          setTimeout(() => {
            props.logout();
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("注销账号失败", error);
        showAlert({
          message: "注销账号失败，请重试",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        setIsLoading(false);
        setShowConfirm(false);
      });
  };

  return (
    <>
      <div className="space-y-3">
        {showConfirm ? (
          <div className="space-y-2">
            <p className="text-sm text-error font-medium">账户与全部想法将被永久删除，此操作不可恢复</p>
            <div className="flex gap-2">
              <button
                className="btn btn-error btn-sm"
                onClick={deleteMyAccount}
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : "确认删除"}
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-error btn-outline btn-sm w-full" onClick={deleteMyAccount}>
            注销账号（删除全部数据，无法恢复）
          </button>
        )}
      </div>

      <Alert
        isOpen={alertOpen}
        onClose={hideAlert}
        message={alertConfig.message}
        type={alertConfig.type}
        duration={alertConfig.duration}
      />
    </>
  );
};

export default DangerousArea;

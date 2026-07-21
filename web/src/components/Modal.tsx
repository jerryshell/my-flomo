import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "确定",
  cancelText = "取消",
  onConfirm,
  showCancel = true,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="text-success">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="text-warning">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="text-error">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="text-info">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex flex-col items-center text-center space-y-4">
          {getIcon()}

          <div className="space-y-2">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            <p className="text-base">{message}</p>
          </div>

          <div className="modal-action">
            {showCancel && (
              <button className="btn btn-outline" onClick={onClose}>
                {cancelText}
              </button>
            )}
            <button
              className={`btn ${
                type === "error"
                  ? "btn-error"
                  : type === "warning"
                    ? "btn-warning"
                    : type === "success"
                      ? "btn-success"
                      : "btn-primary"
              }`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

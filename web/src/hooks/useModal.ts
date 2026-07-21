import { useState, useCallback } from "react";

export const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
    confirmText: "确定",
    cancelText: "取消",
    onConfirm: () => {},
    showCancel: true,
  });

  const showModal = useCallback(
    (config: {
      title?: string;
      message: string;
      type?: "info" | "success" | "warning" | "error";
      confirmText?: string;
      cancelText?: string;
      onConfirm?: () => void;
      showCancel?: boolean;
    }) => {
      setModalConfig({
        title: config.title || "",
        message: config.message,
        type: config.type || "info",
        confirmText: config.confirmText || "确定",
        cancelText: config.cancelText || "取消",
        onConfirm: config.onConfirm || (() => {}),
        showCancel: config.showCancel !== undefined ? config.showCancel : true,
      });
      setModalOpen(true);
    },
    [],
  );

  const hideModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return {
    modalOpen,
    modalConfig,
    showModal,
    hideModal,
  };
};

export const useAlert = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
    duration: 3000,
  });

  const showAlert = useCallback(
    (config: {
      message: string;
      type?: "info" | "success" | "warning" | "error";
      duration?: number;
    }) => {
      setAlertConfig({
        message: config.message,
        type: config.type || "info",
        duration: config.duration || 3000,
      });
      setAlertOpen(true);
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setAlertOpen(false);
  }, []);

  return {
    alertOpen,
    alertConfig,
    showAlert,
    hideAlert,
  };
};

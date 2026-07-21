import { useState } from "react";
import uploadApi from "../api/uploadApi";
import { useAlert } from "../hooks/useModal";
import Alert from "./Alert";

const FlomoImport = (props: { fetchMemoList: () => void }) => {
  const [uploadFileList, setUploadFileList] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { alertOpen, alertConfig, showAlert, hideAlert } = useAlert();

  const handleFileInputChange = (fileList: FileList | null) => {
    setUploadFileList(fileList);
  };

  const handleImportDataBtnClick = () => {
    if (uploadFileList === null) {
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    for (let i = 0; i < uploadFileList.length; i++) {
      formData.append("uploadFileList[]", uploadFileList[i]);
    }

    uploadApi
      .upload(formData)
      .then(() => {
        props.fetchMemoList();
        showAlert({
          message: "导入成功！",
          type: "success",
          duration: 2000,
        });
      })
      .catch(() => {
        showAlert({
          message: "导入失败，请检查文件格式",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        setUploadFileList(null);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="space-y-2">
        <h4 className="font-semibold">从 Flomo 导入</h4>
        <p className="text-sm text-base-content/70">
          请选择从{" "}
          <a
            href="https://flomoapp.com/mine?source=account"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            Flomo
          </a>{" "}
          导出的 HTML 文件，可以一次性选择多个
        </p>

        <div className="form-control">
          <input
            type="file"
            name="uploadFileList"
            accept="text/html"
            multiple
            className="file-input file-input-bordered w-full"
            onChange={(e) => {
              handleFileInputChange(e.target.files);
            }}
          />
        </div>

        {uploadFileList && uploadFileList.length > 0 && (
          <div className="text-sm text-success">已选择 {uploadFileList.length} 个文件</div>
        )}

        <button
          className="btn btn-primary btn-sm"
          onClick={handleImportDataBtnClick}
          disabled={!uploadFileList || isLoading}
        >
          {isLoading ? <span className="loading loading-spinner"></span> : "提交导入"}
        </button>
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

export default FlomoImport;

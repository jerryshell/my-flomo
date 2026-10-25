import { useState } from "react";
import csvApi from "../api/csvApi";
import { useAlert } from "../hooks/useModal";
import Alert from "./Alert";

const CsvImport = (props: { fetchMemoList: () => void }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { alertOpen, alertConfig, showAlert, hideAlert } = useAlert();

  const handleCsvFileInputChange = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      setCsvFile(fileList[0]);
    } else {
      setCsvFile(null);
    }
  };

  const handleCsvImportBtnClick = () => {
    if (csvFile === null) {
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("csvFile", csvFile);

    csvApi
      .csvImport(formData)
      .then((response) => {
        if (response.success) {
          props.fetchMemoList();
          showAlert({
            message: "导入成功",
            type: "success",
            duration: 2000,
          });
        } else {
          showAlert({
            message: response.message,
            type: "error",
            duration: 3000,
          });
        }
      })
      .catch((e) => {
        console.error("CSV 导入失败", e);
        showAlert({
          message: "导入失败，请检查文件格式",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        setCsvFile(null);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="space-y-2">
        <h4 className="font-semibold">CSV 导入</h4>
        <p className="text-sm text-base-content/70">从 CSV 文件导入想法</p>

        <div className="form-control">
          <input
            type="file"
            name="file"
            accept="text/csv"
            className="file-input file-input-bordered w-full"
            onChange={(e) => {
              const files = e.target.files;
              if (files != null && files.length > 0) {
                handleCsvFileInputChange(files);
              }
            }}
          />
        </div>

        {csvFile && <div className="text-sm text-success">已选择文件：{csvFile.name}</div>}

        <button
          className="btn btn-primary btn-sm"
          onClick={handleCsvImportBtnClick}
          disabled={!csvFile || isLoading}
        >
          {isLoading ? <span className="loading loading-spinner"></span> : "导入"}
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

export default CsvImport;

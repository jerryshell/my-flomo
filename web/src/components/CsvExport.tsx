import api from "../api/api";

const CsvExport = () => {
  const handleCsvExportBtnClick = () => {
    const token = localStorage.getItem("token");
    window.open(`${api.defaults.baseURL}/csvExport/token/${token}`);
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">CSV 导出</h4>
      <p className="text-sm text-base-content/70">导出全部想法为 CSV 文件</p>
      <button className="btn btn-outline btn-sm" onClick={handleCsvExportBtnClick}>
        导出文件
      </button>
    </div>
  );
};

export default CsvExport;

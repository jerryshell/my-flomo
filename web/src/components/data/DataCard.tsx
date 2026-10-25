import { useRef, useState } from "react";
import { Download, FileSpreadsheet, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiUrl } from "@/api/api";
import csvApi from "@/api/csvApi";
import uploadApi from "@/api/uploadApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ImportProps {
  onImported: () => Promise<void> | void;
}

const FlomoImport = ({ onImported }: ImportProps) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const run = async () => {
    if (!files || files.length === 0) {
      return;
    }

    const data = new FormData();
    Array.from(files).forEach((file) => data.append("uploadFileList[]", file));

    setBusy(true);
    try {
      const response = await uploadApi.upload(data);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      await onImported();
      toast.success(`已导入 ${files.length} 个文件`);
      setFiles(null);
      if (input.current) {
        input.current.value = "";
      }
    } catch {
      toast.error("导入失败，请检查文件格式");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">从 Flomo 导入</h3>
        <p className="text-xs text-muted-foreground">
          选择 Flomo 导出的 HTML 文件，可以多选。
        </p>
      </div>
      <input
        ref={input}
        type="file"
        name="uploadFileList[]"
        accept="text/html"
        multiple
        className="hidden"
        onChange={(event) => setFiles(event.target.files)}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => input.current?.click()}>
          <FileUp />
          选择文件
        </Button>
        <Button
          size="sm"
          onClick={() => void run()}
          disabled={!files || files.length === 0 || busy}
        >
          {busy && <Loader2 className="animate-spin" />}
          导入
        </Button>
      </div>
      {files && files.length > 0 && (
        <p className="text-xs text-muted-foreground">已选择 {files.length} 个文件</p>
      )}
    </section>
  );
};

const CsvImport = ({ onImported }: ImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const run = async () => {
    if (!file) {
      return;
    }

    const data = new FormData();
    data.append("csvFile", file);

    setBusy(true);
    try {
      const response = await csvApi.csvImport(data);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      await onImported();
      toast.success("CSV 导入完成");
      setFile(null);
      if (input.current) {
        input.current.value = "";
      }
    } catch {
      toast.error("CSV 导入失败，请检查文件格式");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">从 CSV 导入</h3>
        <p className="text-xs text-muted-foreground">
          列顺序为 ID、CreatedAt、UpdatedAt、Content。
        </p>
      </div>
      <input
        ref={input}
        type="file"
        name="csvFile"
        accept="text/csv"
        className="hidden"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => input.current?.click()}>
          <FileSpreadsheet />
          选择文件
        </Button>
        <Button size="sm" onClick={() => void run()} disabled={!file || busy}>
          {busy && <Loader2 className="animate-spin" />}
          导入
        </Button>
      </div>
      {file && <p className="text-xs text-muted-foreground">已选择 {file.name}</p>}
    </section>
  );
};

const CsvExport = () => {
  const token = localStorage.getItem("token") ?? "";

  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">导出 CSV</h3>
        <p className="text-xs text-muted-foreground">导出全部想法，作为本地备份。</p>
      </div>
      {token ? (
        <Button variant="outline" size="sm" asChild>
          <a href={apiUrl(`/csvExport/token/${token}`)}>
            <Download />
            导出 CSV
          </a>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <Download />
          导出 CSV
        </Button>
      )}
    </section>
  );
};

const DataCard = ({ onImported }: ImportProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">数据</CardTitle>
        <CardDescription>导入历史想法，或导出备份。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FlomoImport onImported={onImported} />
        <Separator />
        <CsvImport onImported={onImported} />
        <Separator />
        <CsvExport />
      </CardContent>
    </Card>
  );
};

export default DataCard;

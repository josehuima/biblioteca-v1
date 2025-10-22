import React, { useState } from "react";
import { FileInputButton, FileCard, ExtFile } from "@files-ui/react";

interface UploadBookFileProps {
  bookId: number;
  onUploadComplete: (url: string) => void;
}

const UploadBookFile: React.FC<UploadBookFileProps> = ({ bookId, onUploadComplete }) => {
  const [files, setFiles] = useState<ExtFile[]>([]);

  const updateFiles = (incomingFiles: ExtFile[]) => {
    setFiles(incomingFiles);
  };

  const removeFile = (id: string | number) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  const uploadPdfFile = async (file: File) => {
    console.log("Iniciando upload do PDF:", file.name);

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(",")[1];

        try {
          const response = await fetch("/api/books/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              bookId,
              fileName: file.name,
              base64: base64String
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error("Erro no upload:", result?.error || result);
            reject(new Error("Falha ao fazer upload do PDF"));
          } else {
            console.log("PDF enviado com sucesso:", result);
            if (result?.fileUrl) {
              onUploadComplete(result.fileUrl); // ✅ envia a URL de volta
            }
            resolve();
          }
        } catch (error) {
          console.error("Erro na requisição de upload:", error);
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Erro ao ler o arquivo"));
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 w-full gap-4">
      <FileInputButton
        localization="PT-pt"
        onChange={updateFiles}
        value={files}
        autoClean={false}
        accept={"application/pdf/*"}
        maxFileSize={28000 * 1024}
        maxFiles={1}
        actionButtons={{ position: "bottom", cleanButton: {} }}
      />
      {files.length > 0 && (
        <div className="flex justify-center flex-wrap gap-2 w-full min-w-[50%]">
          {files.map((file) => (
            <FileCard
              localization="PT-pt"
              key={file.id}
              {...file}
              onDelete={removeFile}
              info
            />
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={async () => {
            try {
              await uploadPdfFile(files[0].file);
              alert("PDF enviado com sucesso!");
            } catch (error) {
              alert("Erro ao enviar PDF");
            }
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Enviar PDF
        </button>
      )}
    </div>
  );
};

export default UploadBookFile;

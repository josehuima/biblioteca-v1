"use client";

import { ImageKitProvider, IKUpload, IKImage } from "imagekitio-next";
import { UploadError } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBookAction } from "@/utils/server-actions"; // Your server action
import React from "react";
import UploadBookFile from "./UploadBookFile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

if (!urlEndpoint || !publicKey) {
  throw new Error("Missing ImageKit environment variables.");
}

const authenticator = async () => {
  const res = await fetch("/api/auth");
  const data = await res.json();
  return {
    signature: data.signature,
    expire: data.expire,
    token: data.token,
  };
};

interface BookUploadProps {
  onSuccess?: () => void;
}

const BookUpload = ({ onSuccess }: BookUploadProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    totalCopies: "",
    availableCopies: "",
    isbn: "",
    documentType: "1", // Default to "Livros"
  });

  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadKey, setUploadKey] = useState(Date.now());
  const [dragging, setDragging] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDigital, setIsDigital] = useState(false);

  const handleToggle = () => {
    const newValue = !isDigital;
    setIsDigital(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "isbn") {
      const cleanValue = value.replace(/[^0-9X]/gi, "").slice(0, 13);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!image) {
        toast.error("Por favor adicione a capa do livro.");
        return;
      }

      const { title, author, genre, totalCopies, availableCopies, isbn, documentType } = formData;

      // Pass individual arguments to createBookAction
      await createBookAction(isbn, title, author, genre, parseInt(totalCopies), parseInt(availableCopies), image, parseInt(documentType));

      toast.success("Livro adicionado com sucesso!");
      router.refresh();

      // Reset form
      setFormData({
        title: "",
        author: "",
        genre: "",
        totalCopies: "",
        availableCopies: "",
        isbn: "",
        documentType: "", // Default to "Livros"
      });
      setImage("");
      setProgress(0);
      setUploadKey(Date.now());
      setUploadDone(false);

      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro ao adicionar o livro. Por favor tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSuccess = (res: { filePath: string }) => {
    setImage(res.filePath);
    setUploadDone(true);
    toast.success("Capa enviada com sucesso!");
  };

  const handleImageError = (err: UploadError) => {
    console.error("Upload error:", err);
    toast.error("Ocorreu um erro ao enviar a capa do livro. Por favor tente novamente.");
  };

  const onUploadProgress = (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      setProgress(percent);
    }
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/** Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Titulo</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" placeholder="O mestre Tamoda..." required />
          </div>

          {/** Author */}
          <div>
            <label className="block text-sm font-medium mb-1">Autor</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Uanhenga Xitu..." required />
          </div>

          {/** Genre */}
          <div>
            <label className="block text-sm font-medium mb-1">Genero</label>
            <input type="text" name="genre" value={formData.genre} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ficção, Romance, Ciéntifico" required />
          </div>

          {/** ISBN */}
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className="w-full p-2 border rounded" placeholder="9780743273565" required />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Tipo do Documento</label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, documentType: value })) // value é string
              }
              value={formData.documentType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo do documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Livros</SelectItem>
                <SelectItem value="2">Monografias</SelectItem>
                <SelectItem value="3">Projectos</SelectItem>
                <SelectItem value="4">Outros</SelectItem>
              </SelectContent>
            </Select>

          </div>


          {/** Total Copies */}
          {!isDigital &&
          <div>
            <label className="block text-sm font-medium mb-1">Total Cópias</label>
            <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} className="w-full p-2 border rounded" placeholder="10" min="1" required />
          </div>
}

         
          {/** Available Copies */}
         
          <div>
            <label className="block text-sm font-medium mb-1">Cópias disponíveis</label>
            <input type="number" name="availableCopies" value={formData.availableCopies} onChange={handleChange} className="w-full p-2 border rounded" placeholder="8" min="0" required />
          </div>
        </div>
          

        {/** Image upload */}
        <div
          className={`p-6 border-2 rounded-lg text-center transition ${dragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
        >
          <p className="mb-2">Arraste e solte ficheiros aqui para fazer o upload</p>
          <IKUpload key={uploadKey} fileName="book-cover.png" onSuccess={handleImageSuccess} onError={handleImageError} onUploadProgress={onUploadProgress} className="cursor-pointer" />
        </div>

        {/** Upload progress */}
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {/** Uploaded Image */}
        {image && (
          <div className="mt-4 flex justify-center">
            <IKImage path={image} height={200} width={150} alt="Capa" />
          </div>
        )}

        {isDigital &&
          <UploadBookFile bookId={2} />
        }

            <div className="flex items-center space-x-2">
                <Switch
                  checked={isDigital}
                  onCheckedChange={handleToggle}
                id="airplane-mode" />
                <Label htmlFor="airplane-mode">Livro Digital?</Label>
              </div>

        {/** Submit button */}
        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
            {isSubmitting ? "Adicionando..." : "Adicionar Livro"}
          </button>
        </div>
      </form>
    </ImageKitProvider>
  );
};

export default BookUpload;

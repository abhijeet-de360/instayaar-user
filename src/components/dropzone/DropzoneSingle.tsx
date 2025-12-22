import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

export const DropzoneSingle = ({ images, setImages }: { images: any[], setImages: (imgs: any[]) => void }) => {
    
  const onDrop = (acceptedFiles: File[]) => {
    setImages([...images, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: false,
  });

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  return (
    <div className="w-full">
      {images.length == 0 && <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-md p-6 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? 'Drop images here...' : 'Drag and drop or click to upload images'}
        </p>
      </div>}

      <div className="grid gap-4 mt-4 w-full">
        {images.map((img: any, index) => (
          <div key={index} className="relative w-full">
            <img
              src={typeof img === 'string' ? img : URL.createObjectURL(img)}
              alt={`upload-${index}`}
              className="w-full object-cover rounded border"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 flex items-center justify-center h-4 text-xs"
              onClick={() => handleRemove(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

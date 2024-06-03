import api from '@/app/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post('/file-upload', formData);
      onUploadSuccess(response.data.file);
      toast({
        variant: 'primary',
        title: 'Sucesso',
        description: 'Seu arquivo foi enviado com sucesso.'
      });
    } catch (error) {
      console.log(error);
      // toast({
      //   variant: 'destructive',
      //   title: 'Error',
      //   description: 'There was a problem uploading the file.'
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input
        id="picture"
        type="file"
        onChange={handleFileChange}
        disabled={loading}
      />
    </div>
  );
};

export default FileUpload;

// 'use client';
// import { OurFileRouter } from '@/app/api/uploadthing/core';
// import { UploadDropzone } from '@uploadthing/react';
// import { Trash } from 'lucide-react';
// import Image from 'next/image';
// import { UploadFileResponse } from 'uploadthing/client';
// import { IMG_MAX_LIMIT } from './forms/product-form';
// import { Button } from './ui/button';
// import { useToast } from './ui/use-toast';

// interface ImageUploadProps {
//   onChange?: any;
//   onRemove: (value: UploadFileResponse[]) => void;
//   value: UploadFileResponse[];
// }

// export default function FileUpload({
//   onChange,
//   onRemove,
//   value
// }: ImageUploadProps) {
//   const { toast } = useToast();
//   const onDeleteFile = (key: string) => {
//     const files = value;
//     let filteredFiles = files.filter((item) => item.key !== key);
//     onRemove(filteredFiles);
//   };
//   const onUpdateFile = (newFiles: UploadFileResponse[]) => {
//     onChange([...value, ...newFiles]);
//   };
//   return (
//     <div>
//       <div className="mb-4 flex items-center gap-4">
//         {!!value.length &&
//           value?.map((item) => (
//             <div
//               key={item.key}
//               className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
//             >
//               <div className="absolute right-2 top-2 z-10">
//                 <Button
//                   type="button"
//                   onClick={() => onDeleteFile(item.key)}
//                   variant="destructive"
//                   size="sm"
//                 >
//                   <Trash className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div>
//                 <Image
//                   fill
//                   className="object-cover"
//                   alt="Image"
//                   src={item.fileUrl || ''}
//                 />
//               </div>
//             </div>
//           ))}
//       </div>
//       <div>
//         {value.length < IMG_MAX_LIMIT && (
//           <UploadDropzone<OurFileRouter>
//             className="ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 py-2 dark:bg-zinc-800"
//             endpoint="imageUploader"
//             config={{ mode: 'auto' }}
//             content={{
//               allowedContent({ isUploading }) {
//                 if (isUploading)
//                   return (
//                     <>
//                       <p className="mt-2 animate-pulse text-sm text-slate-400">
//                         Img Uploading...
//                       </p>
//                     </>
//                   );
//               }
//             }}
//             onClientUploadComplete={(res) => {
//               // Do something with the response
//               const data: UploadFileResponse[] | undefined = res;
//               if (data) {
//                 onUpdateFile(data);
//               }
//             }}
//             onUploadError={(error: Error) => {
//               toast({
//                 title: 'Error',
//                 variant: 'destructive',
//                 description: error.message
//               });
//             }}
//             onUploadBegin={() => {
//               // Do something once upload begins
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

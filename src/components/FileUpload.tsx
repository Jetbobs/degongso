"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, Image, Video, FileText } from "lucide-react";
import { toast } from "sonner";
import { FileUpload as FileUploadType } from "@/types";

interface FileUploadProps {
  onFileUpload: (files: FileUploadType[]) => void;
  onFileRemove: (fileId: string) => void;
  maxFiles?: number;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onFileRemove,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ["image/*", "video/*", "application/pdf", "text/*"],
  className = "",
}) => {
  const [files, setFiles] = useState<FileUploadType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 타입 아이콘 결정
  const getFileIcon = (file: File) => {
    const type = file.type.split("/")[0];
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "application":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 파일 검증
  const validateFile = (file: File): string | null => {
    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기가 ${maxSize}MB를 초과합니다.`;
    }

    // 파일 타입 검증
    const isValidType = acceptedTypes.some((type) => {
      if (type.includes("*")) {
        return file.type.startsWith(type.replace("*", ""));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return "지원하지 않는 파일 형식입니다.";
    }

    return null;
  };

  // 파일 업로드 처리
  const handleFileUpload = useCallback(
    async (fileList: FileList) => {
      const newFiles: FileUploadType[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // 파일 개수 제한 확인
        if (files.length + newFiles.length >= maxFiles) {
          toast.error(`최대 ${maxFiles}개의 파일만 업로드 가능합니다.`);
          break;
        }

        // 파일 검증
        const error = validateFile(file);
        if (error) {
          toast.error(`${file.name}: ${error}`);
          continue;
        }

        // 중복 파일 확인
        const isDuplicate = files.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        );
        if (isDuplicate) {
          toast.error(`${file.name}은(는) 이미 업로드되었습니다.`);
          continue;
        }

        // 파일 미리보기 생성
        let preview = "";
        if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        }

        const fileUpload: FileUploadType = {
          file,
          preview,
          uploading: false,
          progress: 0,
          url: "",
        };

        newFiles.push(fileUpload);
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onFileUpload(newFiles);

        // 파일 업로드 시뮬레이션
        simulateUpload(newFiles);
      }
    },
    [files, maxFiles, onFileUpload]
  );

  // 파일 업로드 시뮬레이션
  const simulateUpload = async (filesToUpload: FileUploadType[]) => {
    for (const fileUpload of filesToUpload) {
      fileUpload.uploading = true;

      // 프로그레스 바 시뮬레이션
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        fileUpload.progress = progress;
        setFiles((prev) => [...prev]);
      }

      fileUpload.uploading = false;
      fileUpload.url = `https://example.com/uploads/${Date.now()}-${
        fileUpload.file.name
      }`;
      setFiles((prev) => [...prev]);
    }
  };

  // 파일 제거
  const handleFileRemove = (fileToRemove: FileUploadType) => {
    const updatedFiles = files.filter((f) => f.file !== fileToRemove.file);
    setFiles(updatedFiles);

    // 미리보기 URL 해제
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    onFileRemove(fileToRemove.file.name);
    toast.success("파일이 제거되었습니다.");
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
    // 입력 값 초기화
    e.target.value = "";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 파일 업로드 영역 */}
      <Card
        className={`relative border-2 border-dashed transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <CardContent
          className="p-6 text-center cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            파일 업로드
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            파일을 드래그하거나 클릭하여 업로드하세요
          </p>
          <p className="mt-1 text-xs text-gray-400">
            최대 {maxFiles}개, {maxSize}MB 이하
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* 업로드된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            업로드된 파일 ({files.length})
          </h4>
          {files.map((fileUpload, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center space-x-3">
                {/* 파일 미리보기 또는 아이콘 */}
                <div className="flex-shrink-0">
                  {fileUpload.preview ? (
                    <img
                      src={fileUpload.preview}
                      alt={fileUpload.file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                      {getFileIcon(fileUpload.file)}
                    </div>
                  )}
                </div>

                {/* 파일 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileUpload.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileUpload.file.size)}
                  </p>

                  {/* 업로드 진행률 */}
                  {fileUpload.uploading && (
                    <div className="mt-1">
                      <Progress value={fileUpload.progress} className="h-1" />
                      <p className="text-xs text-gray-500 mt-1">
                        업로드 중... {fileUpload.progress}%
                      </p>
                    </div>
                  )}
                </div>

                {/* 삭제 버튼 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFileRemove(fileUpload)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  Upload,
  FileIcon,
  X,
} from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { FileUpload as FileUploadType } from "@/types";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onFileUpload?: (files: FileUploadType[]) => void;
  maxFileSize?: number; // MB
  acceptedFileTypes?: string[];
  maxFiles?: number;
}

const TiptapEditor = ({
  content,
  onChange,
  placeholder = "내용을 입력하세요...",
  onFileUpload,
  maxFileSize = 10,
  acceptedFileTypes = ["image/*", "video/*", "application/pdf"],
  maxFiles = 5,
}: TiptapEditorProps) => {
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadType[]>([]);
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState<
    FileUploadType[]
  >([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 모든 훅을 먼저 선언
  const validateFile = useCallback(
    (file: File): boolean => {
      // 파일 크기 체크
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`파일 크기는 ${maxFileSize}MB를 초과할 수 없습니다.`);
        return false;
      }

      // 파일 타입 체크
      const isValidType = acceptedFileTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        toast.error("지원하지 않는 파일 형식입니다.");
        return false;
      }

      return true;
    },
    [maxFileSize, acceptedFileTypes]
  );

  const simulateUpload = useCallback(
    (file: File, fileId: string): Promise<string> => {
      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });

            // 파일을 Data URL로 변환
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            setUploadProgress((prev) => ({
              ...prev,
              [fileId]: Math.floor(progress),
            }));
          }
        }, 100);
      });
    },
    []
  );

  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (uploadedFiles.length + files.length > maxFiles) {
        toast.error(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
        return;
      }

      const validFiles = files.filter(validateFile);
      if (validFiles.length === 0) return;

      const newFiles: FileUploadType[] = [];

      for (const file of validFiles) {
        const fileId = `${Date.now()}-${Math.random()}`;

        try {
          setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

          const url = await simulateUpload(file, fileId);

          const fileUpload: FileUploadType = {
            file,
            url,
            progress: 100,
            uploading: false,
          };

          newFiles.push(fileUpload);

          toast.success(`${file.name} 업로드 완료!`);
        } catch (error) {
          console.error("파일 업로드 실패:", error);
          toast.error(`${file.name} 업로드 실패`);
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }
      }

      if (newFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        setNewlyUploadedFiles(newFiles);
        onFileUpload?.(newFiles);
      }
    },
    [uploadedFiles, maxFiles, validateFile, simulateUpload, onFileUpload]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 dark:text-blue-400 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl dark:prose-invert mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // 새로 업로드된 파일들을 에디터에 삽입
  useEffect(() => {
    if (editor && newlyUploadedFiles.length > 0) {
      newlyUploadedFiles.forEach((fileUpload) => {
        const { file, url } = fileUpload;

        // url이 있을 때만 처리
        if (url) {
          // 이미지인 경우 에디터에 직접 삽입
          if (file.type.startsWith("image/")) {
            editor.chain().focus().setImage({ src: url }).run();
          } else {
            // 다른 파일 타입은 링크로 삽입
            const fileName = file.name;
            editor
              .chain()
              .focus()
              .insertContent(
                `<p><a href="${url}" target="_blank" class="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-300">📎 ${fileName}</a></p>`
              )
              .run();
          }
        }
      });

      // 처리된 파일들 초기화
      setNewlyUploadedFiles([]);
    }
  }, [editor, newlyUploadedFiles]);

  // early return은 모든 훅 이후에
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const triggerImageInput = () => {
    imageInputRef.current?.click();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileIndex: number) => {
    setUploadedFiles((prev) => prev.filter((_, index) => index !== fileIndex));
  };

  return (
    <div className="border dark:border-gray-700 rounded-none shadow-none dark:bg-gray-900">
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes.join(",")}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />

      {/* 숨겨진 이미지 입력 */}
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageInputChange}
        style={{ display: "none" }}
      />

      {/* 툴바 */}
      <div className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 sm:p-2 flex flex-wrap gap-1 overflow-x-auto">
        {/* 텍스트 스타일 */}
        <Button
          variant={editor.isActive("bold") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("strike") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("code") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* 헤딩 */}
        <Button
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "outline"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="h-8 w-8 p-0 shadow-none"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "outline"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="h-8 w-8 p-0 shadow-none"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "outline"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="h-8 w-8 p-0 shadow-none"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* 리스트 */}
        <Button
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* 링크 */}
        <Button
          variant={editor.isActive("link") ? "default" : "outline"}
          size="sm"
          onClick={setLink}
          className="h-8 w-8 p-0 shadow-none"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* 이미지 및 파일 업로드 */}
        <Button
          variant="outline"
          size="sm"
          onClick={triggerImageInput}
          className="h-8 w-8 p-0 shadow-none"
          title="이미지 업로드"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          className="h-8 px-2 sm:px-3 shadow-none"
          title="파일 업로드 (드래그앤드롭 지원)"
        >
          <Upload className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">파일</span>
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* 실행취소/재실행 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* 업로드 진행률 표시 */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b dark:border-gray-700">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="mb-2 last:mb-0">
              <div className="flex justify-between text-sm mb-1 dark:text-gray-300">
                <span>파일 업로드 중...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="text-sm font-medium mb-2 dark:text-gray-300">
            첨부된 파일 ({uploadedFiles.length}/{maxFiles})
          </div>
          <div className="space-y-2">
            {uploadedFiles.map((fileUpload, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border dark:border-gray-600"
              >
                <div className="flex items-center gap-2">
                  {fileUpload.file.type.startsWith("image/") ? (
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FileIcon className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-sm truncate max-w-[200px] dark:text-gray-300">
                    {fileUpload.file.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0 hover:bg-red-100"
                >
                  <X className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 에디터 영역 */}
      <div
        className={`min-h-[300px] relative ${
          isDragOver ? "bg-blue-50 dark:bg-blue-900/20" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer?.files || []);
          if (files.length > 0) {
            handleFileUpload(files);
          }
          setIsDragOver(false);
        }}
      >
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 flex items-center justify-center z-10">
            <div className="text-blue-600 dark:text-blue-400 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">파일을 드롭하여 업로드</p>
              <p className="text-xs">이미지, 비디오, PDF 지원</p>
            </div>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;

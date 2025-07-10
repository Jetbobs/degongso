"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TiptapEditor from "@/components/TiptapEditor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FileUpload as FileUploadType } from "@/types";

export default function WritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileUploadType[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }

    const newPost = {
      id: Date.now(), // 임시 ID
      title: formData.title,
      author: "익명",
      date: new Date().toISOString().split("T")[0],
      views: 0,
      content: formData.content,
      fileUrls: uploadedFiles.map((file) => file.url || "").filter(Boolean),
    };

    toast.success("게시글이 작성되었습니다!");
    router.push("/board");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleFileUpload = (files: FileUploadType[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-4 sm:mb-6">
          <Link href="/board">
            <Button
              variant="outline"
              className="border-none shadow-none text-sm"
            >
              ← 목록으로
            </Button>
          </Link>
        </div>

        {/* 글 작성 폼 */}
        <Card className="rounded-none shadow-none">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              새 글 작성
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 제목 */}
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요"
                  className="shadow-none"
                  required
                />
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <TiptapEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  onFileUpload={handleFileUpload}
                  maxFileSize={10}
                  acceptedFileTypes={["image/*", "video/*", "application/pdf"]}
                  maxFiles={5}
                />
              </div>

              {/* 버튼 */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none w-full sm:w-auto border-none shadow-none"
                >
                  작성완료
                </Button>
                <Link href="/board" className="flex-1 sm:flex-none">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto border shadow-none"
                  >
                    취소
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TiptapEditor from "@/components/TiptapEditor";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileUpload as FileUploadType } from "@/types";

// 더미 데이터
const dummyPost = {
  id: 1,
  title: "Next.js 14 새로운 기능 소개",
  author: "김개발",
  date: "2024-01-15",
  views: 245,
  likes: 12,
  content: `
<p>Next.js 14가 출시되었습니다! 이번 업데이트에서는 많은 새로운 기능들이 추가되었습니다.</p>

<h2>주요 변경사항</h2>

<h3>1. Server Components 개선</h3>
<ul>
  <li>React Server Components가 안정화되었습니다</li>
  <li>더 나은 성능과 사용자 경험을 제공합니다</li>
</ul>

<h3>2. Turbopack 안정화</h3>
<ul>
  <li>개발 환경에서 Webpack 대신 Turbopack 사용 가능</li>
  <li>빠른 번들링 속도를 경험할 수 있습니다</li>
</ul>

<h3>3. App Router 개선</h3>
<ul>
  <li>라우팅 시스템이 더욱 강력해졌습니다</li>
  <li>Parallel Routes와 Intercepting Routes 지원</li>
</ul>

<h3>4. 새로운 메타데이터 API</h3>
<ul>
  <li>SEO 최적화가 더욱 쉬워졌습니다</li>
  <li>동적 메타데이터 생성 지원</li>
</ul>

<p>이 밖에도 많은 개선사항들이 있으니 <strong>공식 문서</strong>를 참고해주세요!</p>
  `.trim(),
};

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileUploadType[]>([]);

  // 페이지 로드 시 기존 데이터 불러오기
  useEffect(() => {
    // localStorage에서 수정된 데이터가 있는지 확인
    const savedPost = localStorage.getItem(`post_${postId}`);

    if (savedPost) {
      const parsedPost = JSON.parse(savedPost);
      setFormData({
        title: parsedPost.title,
        author: parsedPost.author,
        content: parsedPost.content,
      });
    } else {
      // 기본 더미 데이터 사용
      setFormData({
        title: dummyPost.title,
        author: dummyPost.author,
        content: dummyPost.content,
      });
    }
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.content.trim()
    ) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    // 수정된 게시글 데이터
    const savedPost = localStorage.getItem(`post_${postId}`);
    const updatedPost = {
      id: parseInt(postId as string),
      title: formData.title,
      author: formData.author,
      date: savedPost
        ? JSON.parse(savedPost).date || dummyPost.date
        : dummyPost.date, // 원래 작성일 유지
      lastModified: new Date().toISOString().split("T")[0], // 수정일 추가
      views: savedPost
        ? JSON.parse(savedPost).views || dummyPost.views
        : dummyPost.views,
      likes: savedPost
        ? JSON.parse(savedPost).likes || dummyPost.likes
        : dummyPost.likes,
      content: formData.content,
      fileUrls: uploadedFiles.map((file) => file.url || "").filter(Boolean),
    };

    // localStorage에 수정된 데이터 저장
    localStorage.setItem(`post_${postId}`, JSON.stringify(updatedPost));

    toast.success("게시글이 수정되었습니다!");
    router.push(`/board/${postId}`);
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
          <Link href={`/board/${postId}`}>
            <Button
              variant="outline"
              className="border-none shadow-none text-sm"
            >
              ← 게시글로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 게시글 수정 폼 */}
        <Card className="rounded-none shadow-none">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              게시글 수정
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

              {/* 작성자 */}
              <div className="space-y-2">
                <Label htmlFor="author">작성자</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="작성자를 입력하세요"
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
                <Link href={`/board/${postId}`} className="flex-1 sm:flex-none">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto border-none shadow-none"
                  >
                    취소
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none w-full sm:w-auto border-none shadow-none"
                >
                  수정완료
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

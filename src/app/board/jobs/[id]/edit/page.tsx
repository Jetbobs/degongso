"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import TiptapEditor from "@/components/TiptapEditor";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileUpload as FileUploadType } from "@/types";
import { X } from "lucide-react";

// 외주구인 더미 데이터
const dummyJobPost = {
  id: 1,
  title: "React.js 웹앱 개발 프로젝트 구인",
  author: "스타트업A",
  date: "2024-01-15",
  views: 145,
  likes: 8,
  budget: "3000만원",
  period: "3개월",
  skills: ["React.js", "TypeScript", "Next.js"],
  content: `
<h2>프로젝트 개요</h2>
<p>React.js와 TypeScript를 사용한 SaaS 플랫폼 개발 프로젝트입니다. 경력 3년 이상의 프론트엔드 개발자를 찾고 있습니다.</p>

<h3>주요 업무</h3>
<ul>
  <li>React.js 기반 웹 애플리케이션 개발</li>
  <li>TypeScript를 활용한 타입 안정성 확보</li>
  <li>Next.js 프레임워크 활용</li>
  <li>반응형 UI/UX 구현</li>
  <li>REST API 연동</li>
</ul>

<h3>필수 요구사항</h3>
<ul>
  <li>React.js 경력 3년 이상</li>
  <li>TypeScript 사용 경험</li>
  <li>Next.js 프레임워크 경험</li>
  <li>Git 사용 가능</li>
</ul>

<p><strong>포트폴리오와 함께 지원해주세요!</strong></p>
  `.trim(),
};

export default function JobsEditPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    budget: "",
    period: "",
    content: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadType[]>([]);

  // 페이지 로드 시 기존 데이터 불러오기
  useEffect(() => {
    // localStorage에서 수정된 데이터가 있는지 확인
    const savedPost = localStorage.getItem(`jobs_post_${postId}`);

    if (savedPost) {
      const parsedPost = JSON.parse(savedPost);
      setFormData({
        title: parsedPost.title,
        company: parsedPost.author, // author가 company 역할
        budget: parsedPost.budget || "",
        period: parsedPost.period || "",
        content: parsedPost.content,
      });
      setSkills(parsedPost.skills || []);
    } else {
      // 기본 더미 데이터 사용
      setFormData({
        title: dummyJobPost.title,
        company: dummyJobPost.author,
        budget: dummyJobPost.budget,
        period: dummyJobPost.period,
        content: dummyJobPost.content,
      });
      setSkills(dummyJobPost.skills);
    }
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.content.trim()
    ) {
      toast.error("프로젝트명, 회사명, 내용을 입력해주세요.");
      return;
    }

    // 수정된 프로젝트 데이터
    const savedPost = localStorage.getItem(`jobs_post_${postId}`);
    const updatedPost = {
      id: parseInt(postId as string),
      title: formData.title,
      author: formData.company, // company를 author로 저장
      budget: formData.budget,
      period: formData.period,
      skills: skills,
      date: savedPost
        ? JSON.parse(savedPost).date || dummyJobPost.date
        : dummyJobPost.date, // 원래 작성일 유지
      lastModified: new Date().toISOString().split("T")[0], // 수정일 추가
      views: savedPost
        ? JSON.parse(savedPost).views || dummyJobPost.views
        : dummyJobPost.views,
      likes: savedPost
        ? JSON.parse(savedPost).likes || dummyJobPost.likes
        : dummyJobPost.likes,
      content: formData.content,
      fileUrls: uploadedFiles.map((file) => file.url || "").filter(Boolean),
    };

    // localStorage에 수정된 데이터 저장
    localStorage.setItem(`jobs_post_${postId}`, JSON.stringify(updatedPost));

    toast.success("프로젝트가 수정되었습니다!");
    router.push(`/board/jobs/${postId}`);
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

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills((prev) => [...prev, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-4 sm:mb-6">
          <Link href={`/board/jobs/${postId}`}>
            <Button
              variant="outline"
              className="border-none shadow-none text-sm"
            >
              ← 프로젝트로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 프로젝트 수정 폼 */}
        <Card className="rounded-none shadow-none">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              프로젝트 수정
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 프로젝트명 */}
              <div className="space-y-2">
                <Label htmlFor="title">프로젝트명 *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="프로젝트명을 입력하세요"
                  className="shadow-none"
                  required
                />
              </div>

              {/* 회사명 */}
              <div className="space-y-2">
                <Label htmlFor="company">회사명 *</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="회사명을 입력하세요"
                  className="shadow-none"
                  required
                />
              </div>

              {/* 예산과 기간 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">예산</Label>
                  <Input
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="예) 3000만원, 협의가능"
                    className="shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">진행기간</Label>
                  <Input
                    id="period"
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    placeholder="예) 3개월, 6주"
                    className="shadow-none"
                  />
                </div>
              </div>

              {/* 기술스택 */}
              <div className="space-y-2">
                <Label htmlFor="skills">기술스택</Label>
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="기술을 입력하고 Enter를 눌러주세요 (예: React.js, Node.js)"
                  className="shadow-none"
                />
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-purple-600 border-purple-600 flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <Label htmlFor="content">프로젝트 상세내용 *</Label>
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
                <Link
                  href={`/board/jobs/${postId}`}
                  className="flex-1 sm:flex-none"
                >
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

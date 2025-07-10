"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import TiptapEditor from "@/components/TiptapEditor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FileUpload as FileUploadType } from "@/types";
import { X } from "lucide-react";

export default function JobsWritePage() {
  const router = useRouter();
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

    const newJobPost = {
      id: Date.now(), // 임시 ID
      title: formData.title,
      author: formData.company,
      date: new Date().toISOString().split("T")[0],
      views: 0,
      likes: 0,
      budget: formData.budget,
      period: formData.period,
      skills: skills,
      content: formData.content,
      fileUrls: uploadedFiles.map((file) => file.url || "").filter(Boolean),
    };

    // localStorage에 저장 (실제로는 API 호출)
    const existingPosts = JSON.parse(localStorage.getItem("jobsPosts") || "[]");
    existingPosts.unshift(newJobPost);
    localStorage.setItem("jobsPosts", JSON.stringify(existingPosts));

    toast.success("프로젝트가 등록되었습니다!");
    router.push("/board/jobs");
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
          <Link href="/board/jobs">
            <Button
              variant="outline"
              className="border-none shadow-none text-sm"
            >
              ← 목록으로
            </Button>
          </Link>
        </div>

        {/* 프로젝트 등록 폼 */}
        <Card className="rounded-none shadow-none">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              새 프로젝트 등록
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

              {/* 안내 메시지 */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  프로젝트 등록 시 포함하면 좋은 내용들:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 프로젝트 목적과 개요</li>
                  <li>• 주요 업무와 책임</li>
                  <li>• 필수 요구사항과 우대사항</li>
                  <li>• 근무 조건과 환경</li>
                  <li>• 지원 방법과 연락처</li>
                </ul>
              </div>

              {/* 버튼 */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none w-full sm:w-auto border-none shadow-none"
                >
                  프로젝트 등록
                </Button>
                <Link href="/board/jobs" className="flex-1 sm:flex-none">
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

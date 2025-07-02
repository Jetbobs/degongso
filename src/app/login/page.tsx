"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 임시 로그인 로직 (실제로는 서버 API 호출)
    console.log("로그인 시도:", formData);

    // 간단한 더미 로그인 체크
    if (
      formData.email === "admin@degongso.com" &&
      formData.password === "123456"
    ) {
      alert("로그인 성공!");
      router.push("/");
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-6 sm:mb-8">
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-bold text-foreground"
          >
            DEGONGSO
          </Link>
        </div>

        {/* 로그인 폼 */}
        <Card className="border-none shadow-none">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">로그인</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                  className="shadow-none"
                  required
                />
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  className="shadow-none"
                  required
                />
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="w-full shadow-none"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* 추가 링크들 */}
            <div className="space-y-4 text-center">
              <div className="text-sm text-muted-foreground">
                계정이 없으신가요?{" "}
                <Link
                  href="/register"
                  className="text-foreground font-medium hover:underline"
                >
                  회원가입
                </Link>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-foreground hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 데모 안내 */}
        <div className="mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            <strong>데모 계정:</strong>
            <br />
            이메일: admin@degongso.com
            <br />
            비밀번호: 123456
          </p>
        </div>

        {/* 하단 링크 */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link href="/">
            <Button
              variant="outline"
              className="border-none shadow-none text-sm"
            >
              ← 홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

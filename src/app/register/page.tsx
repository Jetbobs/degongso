"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // 비밀번호 검증
    if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 닉네임 검증
    if (formData.nickname.trim().length < 2) {
      newErrors.nickname = "닉네임은 2자 이상이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // 기존 사용자 확인 (localStorage 활용)
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const emailExists = existingUsers.some(
      (user: any) => user.email === formData.email
    );
    const nicknameExists = existingUsers.some(
      (user: any) => user.nickname === formData.nickname
    );

    if (emailExists) {
      setErrors({ email: "이미 사용 중인 이메일입니다." });
      setIsLoading(false);
      return;
    }

    if (nicknameExists) {
      setErrors({ nickname: "이미 사용 중인 닉네임입니다." });
      setIsLoading(false);
      return;
    }

    // 새 사용자 추가
    const newUser = {
      id: Date.now(),
      email: formData.email,
      password: formData.password, // 실제로는 해시화 필요
      nickname: formData.nickname,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    toast.success("회원가입이 완료되었습니다!");
    router.push("/login");

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 지우기
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo/디공소 로고(kr_black).png"
              alt="DEGONGSO"
              width={150}
              height={50}
              className="h-10 sm:h-12 w-auto dark:hidden"
              priority
            />
            <Image
              src="/logo/디공소 로고(kr_white).png"
              alt="DEGONGSO"
              width={150}
              height={50}
              className="h-10 sm:h-12 w-auto hidden dark:block"
              priority
            />
          </Link>
        </div>

        {/* 회원가입 폼 */}
        <Card className="border-none shadow-none">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">회원가입</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* 닉네임 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="닉네임을 입력하세요"
                  className="shadow-none"
                  required
                />
                {errors.nickname && (
                  <p className="text-sm text-red-500">{errors.nickname}</p>
                )}
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
                  placeholder="비밀번호를 입력하세요 (6자 이상)"
                  className="shadow-none"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="shadow-none"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                className="w-full shadow-none mt-6"
                disabled={isLoading}
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* 추가 링크들 */}
            <div className="space-y-4 text-center">
              <div className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/login"
                  className="text-foreground font-medium hover:underline"
                >
                  로그인
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 안내 문구 */}
        <div className="mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            회원가입 후 바로 로그인하여 <br /> 게시글 작성 및 댓글을 남길 수
            있습니다.
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

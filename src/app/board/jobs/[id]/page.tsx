"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CommentSection from "@/components/CommentSection";
import SocialActions from "@/components/SocialActions";
import { PostDetailSkeleton } from "@/components/LoadingStates";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThumbsUp, Calendar, DollarSign, Code } from "lucide-react";

// 외주구인 더미 데이터
const dummyJobPost = {
  id: 1,
  title: "React.js 웹앱 개발 프로젝트 구인",
  author: "스타트업A",
  date: "2024-01-15",
  views: 145,
  likes: 8,
  lastModified: undefined as string | undefined,
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

<h3>우대사항</h3>
<ul>
  <li>SaaS 플랫폼 개발 경험</li>
  <li>Tailwind CSS 사용 경험</li>
  <li>상태 관리 라이브러리 경험 (Redux, Zustand 등)</li>
  <li>테스트 코드 작성 경험</li>
</ul>

<h3>근무 조건</h3>
<ul>
  <li>원격 근무 가능</li>
  <li>주 5일 근무</li>
  <li>유연한 근무 시간</li>
</ul>

<p><strong>포트폴리오와 함께 지원해주세요!</strong></p>
  `.trim(),
};

export default function JobPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [currentPost, setCurrentPost] = useState(dummyJobPost);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(dummyJobPost.likes);

  // 페이지 로드 시 localStorage에서 수정된 데이터 확인
  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);

      // 로딩 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const savedPost = localStorage.getItem(`jobs_post_${postId}`);
      if (savedPost) {
        const parsedPost = JSON.parse(savedPost);
        setCurrentPost(parsedPost);
        setLikesCount(parsedPost.likes || dummyJobPost.likes);
      }

      // 좋아요 상태 확인
      const likedPosts = JSON.parse(
        localStorage.getItem("liked_jobs_posts") || "[]"
      );
      setIsLiked(likedPosts.includes(Number(postId)));

      setIsLoading(false);
    };

    loadPost();
  }, [postId]);

  const handleLike = () => {
    const likedPosts = JSON.parse(
      localStorage.getItem("liked_jobs_posts") || "[]"
    );
    const postIdNum = Number(postId);

    if (isLiked) {
      // 좋아요 취소
      const newLikedPosts = likedPosts.filter((id: number) => id !== postIdNum);
      localStorage.setItem("liked_jobs_posts", JSON.stringify(newLikedPosts));
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);

      // 게시글 데이터 업데이트
      const updatedPost = { ...currentPost, likes: likesCount - 1 };
      localStorage.setItem(`jobs_post_${postId}`, JSON.stringify(updatedPost));
      setCurrentPost(updatedPost);

      toast.success("추천을 취소했습니다!");
    } else {
      // 좋아요 추가
      const newLikedPosts = [...likedPosts, postIdNum];
      localStorage.setItem("liked_jobs_posts", JSON.stringify(newLikedPosts));
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);

      // 게시글 데이터 업데이트
      const updatedPost = { ...currentPost, likes: likesCount + 1 };
      localStorage.setItem(`jobs_post_${postId}`, JSON.stringify(updatedPost));
      setCurrentPost(updatedPost);

      toast.success("추천했습니다!");
    }
  };

  const handleDelete = () => {
    // localStorage에서도 삭제
    localStorage.removeItem(`jobs_post_${postId}`);
    toast.success("프로젝트가 삭제되었습니다!");
    router.push("/board/jobs");
  };

  const handleEdit = () => {
    router.push(`/board/jobs/${postId}/edit`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-0 sm:mb-2 sm:mt-2 py-2 md:py-0">
          <Link href="/board/jobs">
            <Button
              variant="outline"
              className="border-none shadow-none text-sm "
            >
              ← 목록으로
            </Button>
          </Link>
        </div>

        <Separator className="" />

        {isLoading ? (
          <PostDetailSkeleton />
        ) : (
          <>
            {/* 프로젝트 정보 */}
            <Card className="border-none shadow-none">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">
                  {currentPost.title}
                </CardTitle>
                <div className="flex flex-col gap-4">
                  {/* 기본 정보 */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <span>회사명: {currentPost.author}</span>
                      <span>등록일: {currentPost.date}</span>
                      {currentPost.lastModified && (
                        <span>수정일: {currentPost.lastModified}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span>조회수: {currentPost.views}</span>
                      <span>추천: {likesCount}</span>
                      <div className="flex items-center">
                        <SocialActions
                          postId={Number(postId)}
                          title={currentPost.title}
                          author={currentPost.author}
                          type="post"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 프로젝트 세부 정보 */}
                  <div className="flex flex-wrap gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">예산:</span>
                      <span className="text-green-600 font-semibold">
                        {currentPost.budget}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">기간:</span>
                      <span className="text-blue-600 font-semibold">
                        {currentPost.period}
                      </span>
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  {currentPost.skills && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">기술스택:</span>
                      </div>
                      {currentPost.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-purple-600 border-purple-600"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            <Separator className="mb-4 sm:mb-6" />

            {/* 프로젝트 내용 */}
            <Card className="rounded-none shadow-none">
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <div
                  className="prose prose-sm sm:prose lg:prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentPost.content }}
                />
              </CardContent>
            </Card>

            {/* 관심 프로젝트 버튼 */}
            <div className="flex justify-center mt-4 sm:mt-6">
              <Button
                onClick={handleLike}
                variant={isLiked ? "default" : "outline"}
                className={`flex items-center gap-2 shadow-none ${
                  isLiked
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "hover:bg-blue-50 hover:text-blue-500 hover:border-blue-500"
                }`}
              >
                <ThumbsUp
                  className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                />
                {isLiked ? "관심 취소" : "관심 프로젝트"} ({likesCount})
              </Button>
            </div>
          </>
        )}

        {/* 댓글 섹션 */}
        {postId && !isLoading && (
          <div className="mt-6 sm:mt-8">
            <CommentSection
              postId={Array.isArray(postId) ? postId[0] : postId}
            />
          </div>
        )}

        {/* 하단 버튼 */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0 sm:space-x-2 mt-4 sm:mt-6">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="shadow-none bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              수정
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="shadow-none">
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4 max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    프로젝트를 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 프로젝트가 영구적으로
                    삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    삭제
                  </AlertDialogAction>
                  <AlertDialogCancel className="bg-white text-black hover:bg-gray-100">
                    취소
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}

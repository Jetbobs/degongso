"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { PostDetailSkeleton } from "@/components/LoadingStates";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// 더미 데이터
const dummyPost = {
  id: 1,
  title: "Next.js 14 새로운 기능 소개",
  author: "김개발",
  date: "2024-01-15",
  views: 245,
  lastModified: undefined as string | undefined,
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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [currentPost, setCurrentPost] = useState(dummyPost);
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 로드 시 localStorage에서 수정된 데이터 확인
  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);

      // 로딩 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const savedPost = localStorage.getItem(`post_${postId}`);
      if (savedPost) {
        const parsedPost = JSON.parse(savedPost);
        setCurrentPost(parsedPost);
      }

      setIsLoading(false);
    };

    loadPost();
  }, [postId]);

  const handleDelete = () => {
    console.log(`게시글 ${postId} 삭제`);
    // localStorage에서도 삭제
    localStorage.removeItem(`post_${postId}`);
    toast.success("게시글이 삭제되었습니다!");
    router.push("/board");
  };

  const handleEdit = () => {
    router.push(`/board/${postId}/edit`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-0 sm:mb-2 sm:mt-2 py-2 md:py-0">
          <Link href="/board">
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
            {/* 게시글 정보 */}
            <Card className="border-none shadow-none">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">
                  {currentPost.title}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    <span>작성자: {currentPost.author}</span>
                    <span>작성일: {currentPost.date}</span>
                    {currentPost.lastModified && (
                      <span>수정일: {currentPost.lastModified}</span>
                    )}
                  </div>
                  <span>조회수: {currentPost.views}</span>
                </div>
              </CardHeader>
            </Card>

            <Separator className="mb-4 sm:mb-6" />

            {/* 게시글 내용 */}
            <Card className="rounded-none shadow-none">
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <div
                  className="prose prose-sm sm:prose lg:prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentPost.content }}
                />
              </CardContent>
            </Card>

            {/* 하단 버튼 */}
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
                      게시글을 삭제하시겠습니까?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      이 작업은 되돌릴 수 없습니다. 게시글이 영구적으로
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
          </>
        )}

        {/* 댓글 섹션 */}
        {postId && !isLoading && (
          <CommentSection postId={Array.isArray(postId) ? postId[0] : postId} />
        )}
      </div>
    </div>
  );
}

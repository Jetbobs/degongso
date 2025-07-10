"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyPostList } from "@/components/LoadingStates";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Bookmark,
  Eye,
  ThumbsUp,
  Calendar,
  User,
  ArrowLeft,
} from "lucide-react";

// 더미 게시글 데이터 (실제로는 API에서 가져올 데이터)
const dummyPosts = [
  {
    id: 1,
    title: "Next.js 14 새로운 기능 소개",
    author: "김개발",
    date: "2024-01-15",
    views: 245,
    likes: 12,
    content:
      "Next.js 14에서는 Server Components, Turbopack, App Router 등 많은 새로운 기능들이 추가되었습니다. 특히 성능 개선과 개발자 경험 향상에 중점을 두었습니다.",
  },
  {
    id: 2,
    title: "Tailwind CSS 활용 팁",
    author: "이디자인",
    date: "2024-01-14",
    views: 189,
    likes: 8,
    content:
      "Tailwind CSS를 효율적으로 사용하는 방법들을 소개합니다. 유틸리티 클래스, 커스텀 컴포넌트, 반응형 디자인 구현 방법 등을 다룹니다.",
  },
  {
    id: 3,
    title: "shadcn/ui 컴포넌트 사용법",
    author: "박프론트",
    date: "2024-01-13",
    views: 167,
    likes: 15,
    content:
      "shadcn/ui는 Radix UI 기반의 아름다운 컴포넌트 라이브러리입니다. 설치부터 커스터마이징까지 전체적인 사용법을 설명합니다.",
  },
];

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로그인 확인
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    loadBookmarks();
  }, [router]);

  const loadBookmarks = async () => {
    setIsLoading(true);

    // 로딩 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const bookmarkIds = JSON.parse(localStorage.getItem("bookmarks") || "[]");

    // 북마크된 게시글 필터링 (실제로는 API 호출)
    const bookmarked = dummyPosts.filter((post) =>
      bookmarkIds.includes(post.id)
    );

    setBookmarkedPosts(bookmarked);
    setIsLoading(false);
  };

  const handleRemoveBookmark = (postId: number) => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const newBookmarks = bookmarks.filter((id: number) => id !== postId);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));

    setBookmarkedPosts((prev) => prev.filter((post) => post.id !== postId));
    toast.success("북마크가 제거되었습니다.");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                북마크 목록을 불러오는 중...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Bookmark className="h-8 w-8 text-yellow-500" />내 북마크
              </h1>
              <p className="text-muted-foreground mt-2">
                저장한 게시글 목록입니다.
              </p>
            </div>
            <Link href="/board">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                게시판으로
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* 통계 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookmarkedPosts.length}
              </div>
              <div className="text-sm text-muted-foreground">
                북마크한 게시글
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bookmarkedPosts.reduce((sum, post) => sum + post.views, 0)}
              </div>
              <div className="text-sm text-muted-foreground">총 조회수</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookmarkedPosts.reduce((sum, post) => sum + post.likes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">총 좋아요</div>
            </CardContent>
          </Card>
        </div>

        {/* 북마크 목록 */}
        {bookmarkedPosts.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              북마크한 게시글이 없습니다
            </h3>
            <p className="text-muted-foreground mb-6">
              관심 있는 게시글을 북마크해보세요!
            </p>
            <Link href="/board">
              <Button>게시판 둘러보기</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarkedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/board/${post.id}`}>
                        <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-muted-foreground mt-2 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Link href={`/board/${post.id}`}>
                        <Button size="sm" variant="outline">
                          읽기
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveBookmark(post.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        제거
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 하단 액션 */}
        {bookmarkedPosts.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link href="/board">
              <Button className="flex items-center gap-2">
                더 많은 게시글 보기
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

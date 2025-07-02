"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";

// 더미 데이터
const dummyPosts = [
  {
    id: 1,
    title: "Next.js 14 새로운 기능 소개",
    author: "김개발",
    date: "2024-01-15",
    views: 245,
  },
  {
    id: 2,
    title: "Tailwind CSS 활용 팁",
    author: "이디자인",
    date: "2024-01-14",
    views: 189,
  },
  {
    id: 3,
    title: "shadcn/ui 컴포넌트 사용법",
    author: "박프론트",
    date: "2024-01-13",
    views: 167,
  },
  {
    id: 4,
    title: "React 18의 새로운 훅들",
    author: "최리액트",
    date: "2024-01-12",
    views: 298,
  },
  {
    id: 5,
    title: "TypeScript 5.0 업데이트",
    author: "정타입",
    date: "2024-01-11",
    views: 221,
  },
  {
    id: 6,
    title: "웹 개발 트렌드 2024",
    author: "홍트렌드",
    date: "2024-01-10",
    views: 412,
  },
  {
    id: 7,
    title: "자바스크립트 ES2024 새 기능",
    author: "송자바",
    date: "2024-01-09",
    views: 356,
  },
  {
    id: 8,
    title: "CSS Grid vs Flexbox 언제 쓸까?",
    author: "이디자인",
    date: "2024-01-08",
    views: 189,
  },
  {
    id: 9,
    title: "Node.js 성능 최적화 방법",
    author: "백엔드김",
    date: "2024-01-07",
    views: 267,
  },
  {
    id: 10,
    title: "Git 브랜치 전략 가이드",
    author: "데브옵스박",
    date: "2024-01-06",
    views: 198,
  },
  {
    id: 11,
    title: "모바일 반응형 디자인 팁",
    author: "모바일정",
    date: "2024-01-05",
    views: 145,
  },
  {
    id: 12,
    title: "웹 접근성 개선하기",
    author: "접근성최",
    date: "2024-01-04",
    views: 123,
  },
  {
    id: 13,
    title: "API 설계 베스트 프랙티스",
    author: "백엔드김",
    date: "2024-01-03",
    views: 289,
  },
  {
    id: 14,
    title: "데이터베이스 설계 원칙",
    author: "디비전문가",
    date: "2024-01-02",
    views: 234,
  },
  {
    id: 15,
    title: "Docker 컨테이너 최적화",
    author: "데브옵스박",
    date: "2024-01-01",
    views: 178,
  },
  {
    id: 16,
    title: "프론트엔드 테스트 전략",
    author: "테스터강",
    date: "2023-12-31",
    views: 156,
  },
  {
    id: 17,
    title: "웹팩 vs Vite 성능 비교",
    author: "빌드도구맨",
    date: "2023-12-30",
    views: 201,
  },
  {
    id: 18,
    title: "PWA 개발 가이드",
    author: "모바일정",
    date: "2023-12-29",
    views: 167,
  },
  {
    id: 19,
    title: "GraphQL vs REST API",
    author: "API설계자",
    date: "2023-12-28",
    views: 245,
  },
  {
    id: 20,
    title: "웹 보안 기본 가이드",
    author: "보안전문가",
    date: "2023-12-27",
    views: 389,
  },
  {
    id: 21,
    title: "마이크로프론트엔드 아키텍처",
    author: "아키텍트윤",
    date: "2023-12-26",
    views: 278,
  },
  {
    id: 22,
    title: "웹 성능 측정 도구들",
    author: "성능튜너",
    date: "2023-12-25",
    views: 134,
  },
  {
    id: 23,
    title: "서버리스 아키텍처 소개",
    author: "클라우드김",
    date: "2023-12-24",
    views: 298,
  },
  {
    id: 24,
    title: "웹 어셈블리(WASM) 시작하기",
    author: "저수준개발자",
    date: "2023-12-23",
    views: 112,
  },
  {
    id: 25,
    title: "크로스 브라우저 호환성",
    author: "호환성박사",
    date: "2023-12-22",
    views: 187,
  },
  {
    id: 26,
    title: "웹 애니메이션 라이브러리 비교",
    author: "애니메이션장",
    date: "2023-12-21",
    views: 156,
  },
  {
    id: 27,
    title: "상태 관리 라이브러리 선택 가이드",
    author: "상태관리왕",
    date: "2023-12-20",
    views: 301,
  },
  {
    id: 28,
    title: "웹 컴포넌트 표준 활용하기",
    author: "표준준수자",
    date: "2023-12-19",
    views: 98,
  },
  {
    id: 29,
    title: "JAMstack 아키텍처 이해하기",
    author: "정적사이트",
    date: "2023-12-18",
    views: 167,
  },
  {
    id: 30,
    title: "웹 폰트 최적화 전략",
    author: "폰트마스터",
    date: "2023-12-17",
    views: 143,
  },
  {
    id: 31,
    title: "CSS 변수 활용 방법",
    author: "CSS마법사",
    date: "2023-12-16",
    views: 198,
  },
  {
    id: 32,
    title: "웹 워커로 성능 개선하기",
    author: "성능최적화",
    date: "2023-12-15",
    views: 234,
  },
  {
    id: 33,
    title: "브라우저 렌더링 최적화",
    author: "렌더링전문가",
    date: "2023-12-14",
    views: 276,
  },
  {
    id: 34,
    title: "웹 스토리지 전략 가이드",
    author: "스토리지매니저",
    date: "2023-12-13",
    views: 165,
  },
  {
    id: 35,
    title: "개발자 도구 활용 팁",
    author: "디버깅왕",
    date: "2023-12-12",
    views: 289,
  },
];

export default function BoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 25;

  // 댓글 개수 가져오기 함수
  const getCommentCount = (postId: number): number => {
    const savedComments = localStorage.getItem(`comments_${postId}`);
    if (savedComments) {
      return JSON.parse(savedComments).length;
    }
    return 0;
  };

  const filteredPosts = dummyPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // 현재 페이지에 표시할 게시글들
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 검색 시 첫 페이지로 이동
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">게시판</h1>
        </div>

        <Separator className="mb-6" />

        {/* 반응형 테이블 뷰 */}
        <div className="border-t border-b overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] sm:w-[80px] text-xs sm:text-sm text-center">
                  번호
                </TableHead>
                <TableHead className="text-xs sm:text-sm">제목</TableHead>
                <TableHead className="hidden sm:table-cell w-[120px] text-xs sm:text-sm">
                  작성자
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[120px] text-xs sm:text-sm">
                  작성일
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[80px] text-xs sm:text-sm">
                  조회/댓글
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-muted/50">
                    <TableCell className="text-xs sm:text-sm text-center">
                      {post.id}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <Link
                        href={`/board/${post.id}`}
                        className="cursor-pointer hover:text-primary hover:underline line-clamp-2 sm:line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      {/* 모바일에서만 표시되는 부가 정보 */}
                      <div className="sm:hidden mt-1 text-xs text-gray-400 space-y-0.5">
                        <div>
                          {post.author} · {post.date} · 조회 {post.views} · 댓글{" "}
                          {getCommentCount(post.id)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                      {post.author}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                      {post.date}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                      {post.views} / {getCommentCount(post.id)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground text-xs sm:text-sm"
                  >
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 검색 및 새 글 작성 */}
        <div className="mt-6 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="hidden sm:block flex-1"></div>
          <div className="flex-1 max-w-md mx-auto">
            <Input
              placeholder="제목 또는 작성자로 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full shadow-none"
            />
          </div>
          <div className="flex-1 flex justify-end">
            <Link href="/board/write">
              <Button className="w-full sm:w-auto shadow-none">
                새 글 작성
              </Button>
            </Link>
          </div>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* 페이지 번호들 */}
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNumber = i + 1;
                  const isCurrentPage = pageNumber === currentPage;

                  // 현재 페이지 주변 페이지만 표시 (최대 5개)
                  const showPage =
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1);

                  if (!showPage) return null;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={isCurrentPage}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {/* 페이지 정보 */}
            <div className="text-center mt-4 text-xs sm:text-sm text-muted-foreground">
              {filteredPosts.length}개의 게시글 중 {startIndex + 1}-
              {Math.min(endIndex, filteredPosts.length)}번째 표시 (페이지{" "}
              {currentPage}/{totalPages})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

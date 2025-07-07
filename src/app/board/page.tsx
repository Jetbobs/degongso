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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PostListSkeleton,
  EmptyPostList,
  EmptySearchResult,
} from "@/components/LoadingStates";
import {
  EnhancedSearchInput,
  HighlightText,
  SearchStats,
} from "@/components/SearchUtils";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// 더미 데이터
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
  {
    id: 4,
    title: "React 18의 새로운 훅들",
    author: "최리액트",
    date: "2024-01-12",
    views: 298,
    likes: 23,
    content:
      "React 18에서 추가된 useId, useTransition, useDeferredValue 등의 새로운 훅들과 Concurrent Features에 대해 알아봅니다.",
  },
  {
    id: 5,
    title: "TypeScript 5.0 업데이트",
    author: "정타입",
    date: "2024-01-11",
    views: 221,
    likes: 19,
    content:
      "TypeScript 5.0의 주요 변경사항들을 살펴봅니다. Decorators, const assertions, 성능 개선 사항들을 중심으로 설명합니다.",
  },
  {
    id: 6,
    title: "웹 개발 트렌드 2024",
    author: "홍트렌드",
    date: "2024-01-10",
    views: 412,
    likes: 31,
    content:
      "2024년 웹 개발 트렌드를 분석합니다. AI 도구 활용, 풀스택 프레임워크, 엣지 컴퓨팅, 웹 성능 최적화 등의 키워드를 중심으로 살펴봅니다.",
  },
  {
    id: 7,
    title: "자바스크립트 ES2024 새 기능",
    author: "송자바",
    date: "2024-01-09",
    views: 356,
    likes: 27,
    content:
      "ES2024에서 추가된 새로운 자바스크립트 기능들을 소개합니다. 새로운 메서드, 연산자, 문법 등을 예제와 함께 설명합니다.",
  },
  {
    id: 8,
    title: "CSS Grid vs Flexbox 언제 쓸까?",
    author: "이디자인",
    date: "2024-01-08",
    views: 189,
    likes: 14,
    content:
      "CSS Grid와 Flexbox의 차이점을 알아보고, 각각을 언제 사용해야 하는지 실제 예제를 통해 설명합니다.",
  },
  {
    id: 9,
    title: "Node.js 성능 최적화 방법",
    author: "백엔드김",
    date: "2024-01-07",
    views: 267,
    likes: 16,
    content:
      "Node.js 애플리케이션의 성능을 개선하는 다양한 방법들을 소개합니다. 메모리 관리, 비동기 처리, 캐싱 전략 등을 다룹니다.",
  },
  {
    id: 10,
    title: "Git 브랜치 전략 가이드",
    author: "데브옵스박",
    date: "2024-01-06",
    views: 198,
    likes: 11,
    content:
      "효과적인 Git 브랜치 전략에 대해 알아봅니다. Git Flow, GitHub Flow, GitLab Flow 등의 워크플로우를 비교분석합니다.",
  },
  {
    id: 11,
    title: "모바일 반응형 디자인 팁",
    author: "모바일정",
    date: "2024-01-05",
    views: 145,
    likes: 9,
    content:
      "모바일 우선 반응형 디자인의 핵심 원칙과 실무 팁을 소개합니다. 미디어 쿼리, 플렉시블 그리드, 터치 인터페이스 고려사항 등을 다룹니다.",
  },
  {
    id: 12,
    title: "웹 접근성 개선하기",
    author: "접근성최",
    date: "2024-01-04",
    views: 123,
    likes: 7,
    content:
      "웹 접근성 가이드라인 WCAG를 바탕으로 모든 사용자가 이용할 수 있는 웹사이트를 만드는 방법을 설명합니다.",
  },
  {
    id: 13,
    title: "API 설계 베스트 프랙티스",
    author: "백엔드김",
    date: "2024-01-03",
    views: 289,
    likes: 22,
  },
  {
    id: 14,
    title: "데이터베이스 설계 원칙",
    author: "디비전문가",
    date: "2024-01-02",
    views: 234,
    likes: 18,
  },
  {
    id: 15,
    title: "Docker 컨테이너 최적화",
    author: "데브옵스박",
    date: "2024-01-01",
    views: 178,
    likes: 13,
  },
  {
    id: 16,
    title: "프론트엔드 테스트 전략",
    author: "테스터강",
    date: "2023-12-31",
    views: 156,
    likes: 10,
  },
  {
    id: 17,
    title: "웹팩 vs Vite 성능 비교",
    author: "빌드도구맨",
    date: "2023-12-30",
    views: 201,
    likes: 15,
  },
  {
    id: 18,
    title: "PWA 개발 가이드",
    author: "모바일정",
    date: "2023-12-29",
    views: 167,
    likes: 12,
  },
  {
    id: 19,
    title: "GraphQL vs REST API",
    author: "API설계자",
    date: "2023-12-28",
    views: 245,
    likes: 20,
  },
  {
    id: 20,
    title: "코드 리뷰 효율적으로 하기",
    author: "리뷰왕",
    date: "2023-12-27",
    views: 198,
    likes: 17,
  },
  {
    id: 21,
    title: "웹 보안 기본 가이드",
    author: "보안전문가",
    date: "2023-12-26",
    views: 389,
    likes: 25,
  },
  {
    id: 22,
    title: "마이크로프론트엔드 아키텍처",
    author: "아키텍트윤",
    date: "2023-12-25",
    views: 278,
    likes: 19,
  },
  {
    id: 23,
    title: "웹 성능 측정 도구들",
    author: "성능튜너",
    date: "2023-12-24",
    views: 134,
    likes: 8,
  },
  {
    id: 24,
    title: "서버리스 아키텍처 소개",
    author: "클라우드김",
    date: "2023-12-23",
    views: 298,
    likes: 21,
  },
  {
    id: 25,
    title: "웹 어셈블리(WASM) 시작하기",
    author: "저수준개발자",
    date: "2023-12-22",
    views: 112,
    likes: 6,
  },
  {
    id: 26,
    title: "크로스 브라우저 호환성",
    author: "호환성박사",
    date: "2023-12-21",
    views: 187,
    likes: 11,
  },
  {
    id: 27,
    title: "웹 애니메이션 라이브러리 비교",
    author: "애니메이션장",
    date: "2023-12-20",
    views: 156,
    likes: 14,
  },
  {
    id: 28,
    title: "상태 관리 라이브러리 선택 가이드",
    author: "상태관리왕",
    date: "2023-12-19",
    views: 301,
    likes: 23,
  },
  {
    id: 29,
    title: "웹 컴포넌트 표준 활용하기",
    author: "표준준수자",
    date: "2023-12-18",
    views: 98,
    likes: 5,
  },
  {
    id: 30,
    title: "JAMstack 아키텍처 이해하기",
    author: "정적사이트",
    date: "2023-12-17",
    views: 167,
    likes: 13,
  },
  {
    id: 31,
    title: "웹 폰트 최적화 전략",
    author: "폰트마스터",
    date: "2023-12-16",
    views: 143,
    likes: 9,
  },
  {
    id: 32,
    title: "CSS 변수 활용 방법",
    author: "CSS마법사",
    date: "2023-12-15",
    views: 198,
    likes: 16,
  },
  {
    id: 33,
    title: "웹 워커로 성능 개선하기",
    author: "성능최적화",
    date: "2023-12-14",
    views: 234,
    likes: 18,
  },
  {
    id: 34,
    title: "브라우저 렌더링 최적화",
    author: "렌더링전문가",
    date: "2023-12-13",
    views: 276,
    likes: 22,
  },
  {
    id: 35,
    title: "웹 스토리지 전략 가이드",
    author: "스토리지매니저",
    date: "2023-12-12",
    views: 165,
    likes: 12,
  },
];

export default function BoardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1초 로딩 시뮬레이션

    // 몇 개 게시글에 더미 댓글 데이터 추가 (테스트용)
    const addDummyComments = () => {
      // 기존 댓글 데이터를 삭제하고 새로운 대댓글 구조로 업데이트
      localStorage.removeItem("comments_1");
      localStorage.removeItem("comments_2");
      localStorage.removeItem("comments_4");
      localStorage.removeItem("comments_6");

      // 게시글 1번에 댓글 3개 (대댓글 포함)
      if (!localStorage.getItem("comments_1")) {
        const comments1 = [
          {
            id: 1,
            postId: 1,
            author: "댓글러1",
            content: "좋은 정보네요! 감사합니다.",
            date: "2024-01-16",
          },
          {
            id: 2,
            postId: 1,
            author: "개발자A",
            content: "저도 동감입니다! 특히 Turbopack 기능이 기대되네요.",
            date: "2024-01-16",
            parentId: 1,
          },
          {
            id: 3,
            postId: 1,
            author: "프론트엔드B",
            content:
              "App Router도 정말 혁신적이라고 생각해요! 개발 경험이 훨씬 좋아졌네요.",
            date: "2024-01-16",
            parentId: 1,
          },
          {
            id: 4,
            postId: 1,
            author: "디자이너C",
            content: "디자인 관점에서도 도움이 많이 되었어요!",
            date: "2024-01-16",
          },
        ];
        localStorage.setItem("comments_1", JSON.stringify(comments1));
      }

      // 게시글 2번에 댓글 1개
      if (!localStorage.getItem("comments_2")) {
        const comments2 = [
          {
            id: 1,
            postId: 2,
            author: "디자이너A",
            content: "CSS 팁 유용해요! 실무에 바로 적용해보겠습니다.",
            date: "2024-01-15",
          },
        ];
        localStorage.setItem("comments_2", JSON.stringify(comments2));
      }

      // 게시글 4번에 댓글 5개 (대댓글 포함)
      if (!localStorage.getItem("comments_4")) {
        const comments4 = [
          {
            id: 1,
            postId: 4,
            author: "리액트팬",
            content:
              "새로운 훅들 정말 유용하네요. 특히 useTransition이 인상 깊어요.",
            date: "2024-01-13",
          },
          {
            id: 2,
            postId: 4,
            author: "개발자B",
            content:
              "useTransition 써봤는데 정말 좋더라구요! UI가 훨씬 부드러워졌어요.",
            date: "2024-01-13",
            parentId: 1,
          },
          {
            id: 3,
            postId: 4,
            author: "코더C",
            content:
              "Concurrent Features 기대됩니다. 성능 개선에 큰 도움이 될 것 같아요.",
            date: "2024-01-13",
            parentId: 1,
          },
          {
            id: 4,
            postId: 4,
            author: "프론트엔드D",
            content:
              "예제 코드도 있으면 좋겠어요. 실제 구현 방법이 궁금합니다.",
            date: "2024-01-13",
          },
          {
            id: 5,
            postId: 4,
            author: "개발초보",
            content:
              "설명이 이해하기 쉬워요! React 18 공부하는데 도움이 많이 됐습니다.",
            date: "2024-01-13",
            parentId: 4,
          },
        ];
        localStorage.setItem("comments_4", JSON.stringify(comments4));
      }

      // 게시글 6번에 댓글 2개 (대댓글 포함)
      if (!localStorage.getItem("comments_6")) {
        const comments6 = [
          {
            id: 1,
            postId: 6,
            author: "트렌드워처",
            content:
              "2024년 트렌드 잘 정리해주셨네요. AI 도구 활용 부분이 특히 인상깊어요.",
            date: "2024-01-11",
          },
          {
            id: 2,
            postId: 6,
            author: "개발매니저",
            content: "팀에 공유했습니다. 올해 기술 로드맵 수립에 참고하겠어요.",
            date: "2024-01-11",
          },
          {
            id: 3,
            postId: 6,
            author: "풀스택개발자",
            content: "엣지 컴퓨팅 트렌드도 정말 중요한 것 같아요!",
            date: "2024-01-11",
            parentId: 1,
          },
        ];
        localStorage.setItem("comments_6", JSON.stringify(comments6));
      }
    };

    addDummyComments();

    return () => clearTimeout(timer);
  }, []);

  // 댓글 개수 가져오기 함수
  const getCommentCount = (postId: number): number => {
    const savedComments = localStorage.getItem(`comments_${postId}`);
    if (savedComments) {
      return JSON.parse(savedComments).length;
    }
    return 0;
  };

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = dummyPosts.filter((post) => {
      if (!searchTerm) return true;

      const lowerSearchTerm = searchTerm.toLowerCase();

      switch (searchType) {
        case "title":
          return post.title.toLowerCase().includes(lowerSearchTerm);
        case "author":
          return post.author.toLowerCase().includes(lowerSearchTerm);
        case "content":
          return post.content?.toLowerCase().includes(lowerSearchTerm);
        default:
          return (
            post.title.toLowerCase().includes(lowerSearchTerm) ||
            post.author.toLowerCase().includes(lowerSearchTerm) ||
            post.content?.toLowerCase().includes(lowerSearchTerm)
          );
      }
    });

    // 최신순 정렬 (날짜 기준)
    const sorted = [...filtered].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return sorted;
  }, [searchTerm, searchType]);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);

  // 현재 페이지에 표시할 게시글들
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex);

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 짧은 로딩 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // 검색 핸들러
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setIsLoading(true);

    // 검색 로딩 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchTypeChange = (type: string) => {
    setSearchType(type);
    setCurrentPage(1);
    if (searchTerm.trim()) {
      setIsLoading(true);
      // 검색 타입 변경 시 로딩 시뮬레이션
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  // 검색 타입에 따른 플레이스홀더 텍스트
  const getPlaceholder = () => {
    switch (searchType) {
      case "title":
        return "제목으로 검색...";
      case "content":
        return "내용으로 검색...";
      case "author":
        return "작성자로 검색...";
      case "all":
      default:
        return "제목, 내용, 작성자로 검색...";
    }
  };

  // 페이지 당 항목 수 변경
  const handlePostsPerPageChange = (value: string) => {
    setIsLoading(true);
    setPostsPerPage(Number(value));
    setCurrentPage(1);

    // 짧은 로딩 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // 스마트한 페이지 번호 생성 함수
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPages = 7; // 모바일에서는 5개, 데스크톱에서는 7개

    if (totalPages <= maxPages) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 복잡한 경우 스마트하게 표시
      if (currentPage <= 4) {
        // 앞쪽 페이지들
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 뒤쪽 페이지들
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간 페이지들
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">게시판</h1>

          {/* 페이지 당 항목 수 선택 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">페이지당</span>
            <Select
              value={postsPerPage.toString()}
              onValueChange={handlePostsPerPageChange}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">개씩</span>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* 게시글 목록 영역 */}
        <div className="border-t border-b overflow-x-auto">
          {isLoading ? (
            <PostListSkeleton />
          ) : (
            <>
              {/* 빈 상태 처리 */}
              {filteredAndSortedPosts.length === 0 ? (
                searchTerm ? (
                  <EmptySearchResult searchTerm={searchTerm} />
                ) : dummyPosts.length === 0 ? (
                  <EmptyPostList />
                ) : (
                  <EmptySearchResult searchTerm={searchTerm} />
                )
              ) : (
                /* 게시글 테이블 */
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
                        조회
                      </TableHead>
                      <TableHead className="hidden sm:table-cell w-[80px] text-xs sm:text-sm">
                        추천
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPosts.map((post, index) => (
                      <TableRow key={post.id} className="hover:bg-muted/50">
                        <TableCell className="text-xs sm:text-sm text-center">
                          {filteredAndSortedPosts.length -
                            (currentPage - 1) * postsPerPage -
                            index}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <Link
                            href={`/board/${post.id}`}
                            className="cursor-pointer hover:text-primary hover:underline line-clamp-2 sm:line-clamp-1"
                          >
                            <HighlightText
                              text={post.title}
                              searchTerm={searchTerm}
                            />
                            {getCommentCount(post.id) > 0 && (
                              <span className="text-muted-foreground">
                                ({getCommentCount(post.id)})
                              </span>
                            )}
                          </Link>
                          {/* 모바일에서만 표시되는 부가 정보 */}
                          <div className="sm:hidden mt-1 text-xs text-gray-400 space-y-0.5">
                            <div>
                              <HighlightText
                                text={post.author}
                                searchTerm={searchTerm}
                              />{" "}
                              · {post.date} · 조회 {post.views} · 추천{" "}
                              {post.likes}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          <HighlightText
                            text={post.author}
                            searchTerm={searchTerm}
                          />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {post.date}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {post.views}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {post.likes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </div>

        {/* 검색 및 새 글 작성 */}
        <div className="mt-6 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <SearchStats
            totalCount={dummyPosts.length}
            filteredCount={filteredAndSortedPosts.length}
            searchTerm={searchTerm}
            searchType={searchType}
          />
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* 검색 타입 선택 드롭다운 */}
              <Select value={searchType} onValueChange={handleSearchTypeChange}>
                <SelectTrigger className="w-full sm:w-32 shadow-none rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="title">제목</SelectItem>
                  <SelectItem value="content">내용</SelectItem>
                  <SelectItem value="author">작성자</SelectItem>
                </SelectContent>
              </Select>

              {/* 검색 입력 필드 */}
              <div className="flex-1">
                <EnhancedSearchInput
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onSearch={handleSearch}
                  placeholder={getPlaceholder()}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Link href="/board/write">
              <Button className="w-full sm:w-auto shadow-none">
                새 글 작성
              </Button>
            </Link>
          </div>
        </div>

        {/* 개선된 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-6 space-y-4">
            {/* 데스크톱 페이지네이션 */}
            <div className="hidden sm:block">
              <Pagination>
                <PaginationContent>
                  {/* 맨 처음으로 */}
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 border-0 shadow-none"
                    >
                      <ChevronFirst className="h-4 w-4" />
                    </Button>
                  </PaginationItem>

                  {/* 이전 페이지 */}
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

                  {/* 스마트 페이지 번호들 */}
                  {generatePageNumbers().map((page, index) => (
                    <PaginationItem key={`${page}-${index}`}>
                      {page === "..." ? (
                        <span className="px-4 py-2 text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  {/* 다음 페이지 */}
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

                  {/* 맨 마지막으로 */}
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0 border-0 shadow-none"
                    >
                      <ChevronLast className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            {/* 모바일 간단 페이지네이션 */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 border-0 shadow-none"
                >
                  <ChevronFirst className="h-4 w-4" />
                  이전
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 border-0 shadow-none"
                >
                  다음
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 페이지 정보 */}
            <div className="text-center text-xs sm:text-sm text-muted-foreground">
              {startIndex + 1}-
              {Math.min(endIndex, filteredAndSortedPosts.length)}번째 표시
              <span className="mx-2">·</span>
              페이지 {currentPage} / {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

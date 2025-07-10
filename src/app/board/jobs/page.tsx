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

// 외주구인 더미 데이터
const dummyPosts = [
  {
    id: 1,
    title: "React.js 웹앱 개발 프로젝트 구인",
    author: "스타트업A",
    date: "2024-01-15",
    views: 145,
    likes: 8,
    content:
      "React.js와 TypeScript를 사용한 SaaS 플랫폼 개발 프로젝트입니다. 경력 3년 이상의 프론트엔드 개발자를 찾고 있습니다. 기간: 3개월, 예산: 협의 가능",
    budget: "3000만원",
    period: "3개월",
    skills: ["React.js", "TypeScript", "Next.js"],
  },
  {
    id: 2,
    title: "Node.js 백엔드 API 개발 외주",
    author: "테크기업B",
    date: "2024-01-14",
    views: 98,
    likes: 5,
    content:
      "Node.js 기반 RESTful API 개발 프로젝트입니다. Express.js, MongoDB 경험이 있는 백엔드 개발자를 찾습니다.",
    budget: "2000만원",
    period: "2개월",
    skills: ["Node.js", "Express.js", "MongoDB"],
  },
  {
    id: 3,
    title: "모바일 앱 UI/UX 디자인 의뢰",
    author: "앱개발회사C",
    date: "2024-01-13",
    views: 167,
    likes: 12,
    content:
      "iOS/Android 모바일 앱의 UI/UX 디자인을 의뢰합니다. Figma 사용 가능하고 모바일 디자인 경험이 풍부한 디자이너 우대",
    budget: "1500만원",
    period: "1.5개월",
    skills: ["Figma", "UI/UX", "모바일디자인"],
  },
  {
    id: 4,
    title: "Flutter 크로스플랫폼 앱 개발",
    author: "스타트업D",
    date: "2024-01-12",
    views: 234,
    likes: 15,
    content:
      "Flutter를 사용한 크로스플랫폼 모바일 앱 개발 프로젝트입니다. Firebase 연동 경험 필수입니다.",
    budget: "4000만원",
    period: "4개월",
    skills: ["Flutter", "Dart", "Firebase"],
  },
  {
    id: 5,
    title: "Vue.js 웹사이트 리뉴얼 프로젝트",
    author: "쇼핑몰E",
    date: "2024-01-11",
    views: 189,
    likes: 9,
    content:
      "기존 레거시 웹사이트를 Vue.js로 리뉴얼하는 프로젝트입니다. Vuex, Vue Router 경험 필수",
    budget: "2500만원",
    period: "3개월",
    skills: ["Vue.js", "Vuex", "Vue Router"],
  },
  {
    id: 6,
    title: "Python Django 웹 애플리케이션 개발",
    author: "교육회사F",
    date: "2024-01-10",
    views: 156,
    likes: 7,
    content:
      "Django 기반 온라인 교육 플랫폼 개발 프로젝트입니다. PostgreSQL, Redis 경험 우대",
    budget: "3500만원",
    period: "5개월",
    skills: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: 7,
    title: "WordPress 쇼핑몰 커스터마이징",
    author: "온라인쇼핑몰G",
    date: "2024-01-09",
    views: 123,
    likes: 6,
    content:
      "WooCommerce 기반 WordPress 쇼핑몰 커스터마이징 작업입니다. PHP, MySQL 경험 필수",
    budget: "800만원",
    period: "1개월",
    skills: ["WordPress", "WooCommerce", "PHP"],
  },
  {
    id: 8,
    title: "Spring Boot 마이크로서비스 개발",
    author: "핀테크H",
    date: "2024-01-08",
    views: 278,
    likes: 18,
    content:
      "Spring Boot 기반 마이크로서비스 아키텍처 구축 프로젝트입니다. Docker, Kubernetes 경험 필수",
    budget: "5000만원",
    period: "6개월",
    skills: ["Spring Boot", "Docker", "Kubernetes"],
  },
  {
    id: 9,
    title: "React Native 모바일 앱 개발",
    author: "헬스케어I",
    date: "2024-01-07",
    views: 201,
    likes: 11,
    content:
      "헬스케어 관련 React Native 모바일 앱 개발 프로젝트입니다. REST API 연동 경험 필수",
    budget: "2800만원",
    period: "3.5개월",
    skills: ["React Native", "JavaScript", "REST API"],
  },
  {
    id: 10,
    title: "Unity 3D 게임 개발 외주",
    author: "게임회사J",
    date: "2024-01-06",
    views: 345,
    likes: 22,
    content:
      "Unity 3D를 사용한 모바일 게임 개발 프로젝트입니다. C# 프로그래밍과 3D 그래픽 경험 필수",
    budget: "6000만원",
    period: "8개월",
    skills: ["Unity 3D", "C#", "3D Graphics"],
  },
  {
    id: 11,
    title: "Angular 기업용 대시보드 개발",
    author: "기업솔루션K",
    date: "2024-01-05",
    views: 132,
    likes: 8,
    content:
      "Angular를 사용한 기업용 데이터 대시보드 개발 프로젝트입니다. Chart.js, D3.js 경험 우대",
    budget: "2200만원",
    period: "2.5개월",
    skills: ["Angular", "TypeScript", "Chart.js"],
  },
  {
    id: 12,
    title: "Laravel PHP 웹사이트 개발",
    author: "의료법인L",
    date: "2024-01-04",
    views: 98,
    likes: 4,
    content:
      "Laravel 프레임워크를 사용한 의료진 관리 웹사이트 개발 프로젝트입니다. MySQL, Redis 경험 필수",
    budget: "1800만원",
    period: "2개월",
    skills: ["Laravel", "PHP", "MySQL"],
  },
  {
    id: 13,
    title: "Svelte 웹앱 프론트엔드 개발",
    author: "스타트업M",
    date: "2024-01-03",
    views: 167,
    likes: 10,
  },
  {
    id: 14,
    title: "Express.js REST API 개발",
    author: "테크기업N",
    date: "2024-01-02",
    views: 189,
    likes: 13,
  },
  {
    id: 15,
    title: "React 컴포넌트 라이브러리 구축",
    author: "디자인시스템O",
    date: "2024-01-01",
    views: 234,
    likes: 16,
  },
];

export default function JobsBoardPage() {
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
      localStorage.removeItem("jobs_comments_1");
      localStorage.removeItem("jobs_comments_4");
      localStorage.removeItem("jobs_comments_8");

      // 외주구인 게시글 1번에 댓글 2개
      if (!localStorage.getItem("jobs_comments_1")) {
        const comments1 = [
          {
            id: 1,
            postId: 1,
            author: "프론트개발자A",
            content: "React 경력 4년차입니다. 포트폴리오 확인 후 연락 주세요!",
            date: "2024-01-16",
          },
          {
            id: 2,
            postId: 1,
            author: "풀스택개발자B",
            content: "TypeScript 경험 풍부합니다. 참여 희망합니다.",
            date: "2024-01-16",
          },
        ];
        localStorage.setItem("jobs_comments_1", JSON.stringify(comments1));
      }

      // 외주구인 게시글 4번에 댓글 3개
      if (!localStorage.getItem("jobs_comments_4")) {
        const comments4 = [
          {
            id: 1,
            postId: 4,
            author: "Flutter개발자C",
            content:
              "Flutter 앱 개발 경력 3년입니다. Firebase 연동 경험 있습니다.",
            date: "2024-01-13",
          },
          {
            id: 2,
            postId: 4,
            author: "모바일개발자D",
            content: "크로스플랫폼 개발 전문입니다. 상세 논의 원합니다.",
            date: "2024-01-13",
          },
          {
            id: 3,
            postId: 4,
            author: "앱개발팀E",
            content: "팀 단위 지원 가능합니다. 레퍼런스 많습니다.",
            date: "2024-01-13",
          },
        ];
        localStorage.setItem("jobs_comments_4", JSON.stringify(comments4));
      }

      // 외주구인 게시글 8번에 댓글 4개
      if (!localStorage.getItem("jobs_comments_8")) {
        const comments8 = [
          {
            id: 1,
            postId: 8,
            author: "백엔드전문가F",
            content:
              "Spring Boot 마이크로서비스 구축 경험 다수 보유하고 있습니다.",
            date: "2024-01-09",
          },
          {
            id: 2,
            postId: 8,
            author: "DevOps엔지니어G",
            content: "Docker, Kubernetes 운영 경험 5년차입니다.",
            date: "2024-01-09",
          },
          {
            id: 3,
            postId: 8,
            author: "클라우드전문가H",
            content: "AWS 기반 마이크로서비스 아키텍처 설계 가능합니다.",
            date: "2024-01-09",
          },
          {
            id: 4,
            postId: 8,
            author: "시니어개발자I",
            content: "핀테크 도메인 경험 있습니다. 참여 희망합니다.",
            date: "2024-01-09",
          },
        ];
        localStorage.setItem("jobs_comments_8", JSON.stringify(comments8));
      }
    };

    addDummyComments();

    return () => clearTimeout(timer);
  }, []);

  // 댓글 개수 가져오기 함수
  const getCommentCount = (postId: number): number => {
    const savedComments = localStorage.getItem(`jobs_comments_${postId}`);
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
        case "skills":
          return post.skills?.some((skill) =>
            skill.toLowerCase().includes(lowerSearchTerm)
          );
        default:
          return (
            post.title.toLowerCase().includes(lowerSearchTerm) ||
            post.author.toLowerCase().includes(lowerSearchTerm) ||
            post.content?.toLowerCase().includes(lowerSearchTerm) ||
            post.skills?.some((skill) =>
              skill.toLowerCase().includes(lowerSearchTerm)
            )
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
        return "검색어를 입력해주세요";
      case "content":
        return "검색어를 입력해주세요";
      case "author":
        return "검색어를 입력해주세요";
      case "skills":
        return "검색어를 입력해주세요";
      case "all":
      default:
        return "검색어를 입력해주세요";
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
          <h1 className="text-2xl sm:text-3xl font-bold">외주구인게시판</h1>

          {/* 페이지 당 항목 수 선택 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">페이지당</span>
            <Select
              value={postsPerPage.toString()}
              onValueChange={handlePostsPerPageChange}
            >
              <SelectTrigger className="w-20 h-8 rounded-none">
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
                      <TableHead className="text-xs sm:text-sm">
                        프로젝트명
                      </TableHead>
                      <TableHead className="hidden sm:table-cell w-[120px] text-xs sm:text-sm text-center">
                        회사명
                      </TableHead>
                      <TableHead className="hidden sm:table-cell w-[120px] text-xs sm:text-sm text-center">
                        등록일
                      </TableHead>
                      <TableHead className="hidden sm:table-cell w-[80px] text-xs sm:text-sm text-center">
                        조회
                      </TableHead>
                      <TableHead className="hidden sm:table-cell w-[80px] text-xs sm:text-sm text-center">
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
                            href={`/board/jobs/${post.id}`}
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
                            {post.budget && post.period && (
                              <div className="text-blue-600">
                                예산 {post.budget} · 기간 {post.period}
                              </div>
                            )}
                            {post.skills && (
                              <div className="flex flex-wrap gap-1">
                                {post.skills.slice(0, 3).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {post.skills.length > 3 && (
                                  <span className="text-gray-500">
                                    +{post.skills.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm text-center">
                          <HighlightText
                            text={post.author}
                            searchTerm={searchTerm}
                          />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm text-center">
                          {post.date}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm text-center">
                          {post.views}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm text-center">
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

        {/* 검색 및 새 프로젝트 등록 */}
        <div className="mt-6 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <SearchStats
            totalCount={dummyPosts.length}
            filteredCount={filteredAndSortedPosts.length}
            searchTerm={searchTerm}
            searchType={searchType}
          />
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex gap-2">
              {/* 검색 타입 선택 드롭다운 */}
              <Select value={searchType} onValueChange={handleSearchTypeChange}>
                <SelectTrigger className="w-24 sm:w-32 shadow-none rounded-none text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all" className="text-xs md:text-sm">
                    전체
                  </SelectItem>
                  <SelectItem value="title" className="text-xs md:text-sm">
                    프로젝트명
                  </SelectItem>
                  <SelectItem value="content" className="text-xs md:text-sm">
                    내용
                  </SelectItem>
                  <SelectItem value="author" className="text-xs md:text-sm">
                    회사명
                  </SelectItem>
                  <SelectItem value="skills" className="text-xs md:text-sm">
                    기술스택
                  </SelectItem>
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
            <Link href="/board/jobs/write">
              <Button className="w-full sm:w-auto shadow-none">
                프로젝트 등록
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
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 border-0 shadow-none"
                  >
                    <ChevronFirst className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 border-0 shadow-none text-xs"
                  >
                    이전
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 border-0 shadow-none text-xs"
                  >
                    다음
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 border-0 shadow-none"
                  >
                    <ChevronLast className="h-4 w-4" />
                  </Button>
                </div>
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

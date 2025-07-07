import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// 더미 데이터
const dashboardData = {
  stats: {
    totalPosts: 1247,
    todayPosts: 23,
    activeUsers: 156,
    newMembers: 8,
  },
  recentPosts: {
    free: [
      {
        id: 1,
        title: "Next.js 14 새로운 기능 소개",
        author: "김개발",
        date: "2024-01-15",
        views: 245,
        likes: 12,
      },
      {
        id: 2,
        title: "React Server Components 사용법",
        author: "박프론트",
        date: "2024-01-14",
        views: 182,
        likes: 8,
      },
      {
        id: 3,
        title: "TypeScript 5.0 업데이트 정리",
        author: "이타입",
        date: "2024-01-14",
        views: 167,
        likes: 15,
      },
    ],
    jobs: [
      {
        id: 1,
        title: "React 개발자 구합니다 (프리랜서)",
        author: "스타트업A",
        date: "2024-01-15",
        budget: "300만원",
        likes: 5,
      },
      {
        id: 2,
        title: "백엔드 API 개발 외주",
        author: "회사B",
        date: "2024-01-14",
        budget: "200만원",
        likes: 3,
      },
      {
        id: 3,
        title: "모바일 앱 개발 파트너 찾습니다",
        author: "개인사업자C",
        date: "2024-01-13",
        budget: "500만원",
        likes: 8,
      },
    ],
    portfolio: [
      {
        id: 1,
        title: "개인 포트폴리오 사이트 제작",
        author: "디자이너김",
        date: "2024-01-15",
        tech: "Next.js",
        likes: 22,
      },
      {
        id: 2,
        title: "전자상거래 플랫폼 구축",
        author: "풀스택이",
        date: "2024-01-14",
        tech: "React",
        likes: 18,
      },
      {
        id: 3,
        title: "모바일 게임 UI/UX 디자인",
        author: "게임러",
        date: "2024-01-13",
        tech: "Unity",
        likes: 31,
      },
    ],
    education: [
      {
        id: 1,
        title: "무료 React 기초 강의 오픈!",
        author: "교육전문가",
        date: "2024-01-15",
        students: 45,
        likes: 16,
      },
      {
        id: 2,
        title: "JavaScript ES6+ 완전정복",
        author: "코딩선생",
        date: "2024-01-14",
        students: 78,
        likes: 24,
      },
      {
        id: 3,
        title: "Git/GitHub 실무 활용법",
        author: "개발멘토",
        date: "2024-01-13",
        students: 92,
        likes: 19,
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              DEGONGSO 대시보드
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              개발자 커뮤니티의 최신 소식을 한눈에 확인하세요
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card className="shadow-none">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  전체 게시글
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="text-lg sm:text-2xl font-bold">
                  {dashboardData.stats.totalPosts}
                </div>
                <p className="text-xs text-muted-foreground">전체 누적</p>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  오늘 게시글
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="text-lg sm:text-2xl font-bold">
                  {dashboardData.stats.todayPosts}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  활성 사용자
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="text-lg sm:text-2xl font-bold">
                  {dashboardData.stats.activeUsers}
                </div>
                <p className="text-xs text-muted-foreground">현재 온라인</p>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  신규 회원
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="text-lg sm:text-2xl font-bold">
                  {dashboardData.stats.newMembers}
                </div>
                <p className="text-xs text-muted-foreground">오늘 가입</p>
              </CardContent>
            </Card>
          </div>

          {/* 게시판별 최신 글 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 자유게시판 */}
            <Card className="shadow-none">
              <CardHeader className="px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    💬 자유게시판
                    <Badge variant="secondary" className="text-xs">
                      {dashboardData.recentPosts.free.length}
                    </Badge>
                  </CardTitle>
                  <Link href="/board">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs shadow-none"
                    >
                      전체보기
                    </Button>
                  </Link>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  개발 관련 자유로운 토론
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-2 sm:space-y-3">
                  {dashboardData.recentPosts.free.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-xs sm:text-sm mb-1 line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {post.author} · {post.date} · 조회 {post.views} · 추천{" "}
                          {post.likes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 외주구인게시판 */}
            <Card className="shadow-none">
              <CardHeader className="px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    💼 외주구인게시판
                    <Badge variant="secondary" className="text-xs">
                      {dashboardData.recentPosts.jobs.length}
                    </Badge>
                  </CardTitle>
                  <Link href="/board/jobs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs shadow-none"
                    >
                      전체보기
                    </Button>
                  </Link>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  프리랜서 및 외주 프로젝트
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-2 sm:space-y-3">
                  {dashboardData.recentPosts.jobs.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-xs sm:text-sm mb-1 line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {post.author} · {post.date} · {post.budget} · 추천{" "}
                          {post.likes}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        급구
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 포트폴리오자랑 */}
            <Card className="shadow-none">
              <CardHeader className="px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    🎨 포트폴리오자랑
                    <Badge variant="secondary" className="text-xs">
                      {dashboardData.recentPosts.portfolio.length}
                    </Badge>
                  </CardTitle>
                  <Link href="/board/portfolio">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs shadow-none"
                    >
                      전체보기
                    </Button>
                  </Link>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  완성한 프로젝트 자랑하기
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-2 sm:space-y-3">
                  {dashboardData.recentPosts.portfolio.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-xs sm:text-sm mb-1 line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {post.author} · {post.date} · {post.tech} · 추천{" "}
                          {post.likes}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        NEW
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 무료교육 */}
            <Card className="shadow-none">
              <CardHeader className="px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    📚 무료교육
                    <Badge variant="secondary" className="text-xs">
                      {dashboardData.recentPosts.education.length}
                    </Badge>
                  </CardTitle>
                  <Link href="/board/education">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs shadow-none"
                    >
                      전체보기
                    </Button>
                  </Link>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  무료 강의 및 교육 자료
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-2 sm:space-y-3">
                  {dashboardData.recentPosts.education.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-xs sm:text-sm mb-1 line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {post.author} · {post.date} · 수강생 {post.students}명
                          · 추천 {post.likes}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        FREE
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 빠른 액션 */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4">빠른 액션</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/board/write">
                <Button
                  className="w-full h-16 sm:h-20 shadow-none"
                  variant="outline"
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-xl mb-1">✍️</div>
                    <div className="text-xs sm:text-sm">글쓰기</div>
                  </div>
                </Button>
              </Link>
              <Link href="/board">
                <Button
                  className="w-full h-16 sm:h-20 shadow-none"
                  variant="outline"
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-xl mb-1">💬</div>
                    <div className="text-xs sm:text-sm">자유게시판</div>
                  </div>
                </Button>
              </Link>
              <Link href="/board/jobs">
                <Button
                  className="w-full h-16 sm:h-20 shadow-none"
                  variant="outline"
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-xl mb-1">💼</div>
                    <div className="text-xs sm:text-sm">외주구인</div>
                  </div>
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  className="w-full h-16 sm:h-20 shadow-none"
                  variant="outline"
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-xl mb-1">🔐</div>
                    <div className="text-xs sm:text-sm">로그인</div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

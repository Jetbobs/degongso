"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Users,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Shield,
  Settings,
  BarChart3,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  recentPosts: any[];
  recentUsers: any[];
  reportedContent: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
    recentPosts: [],
    recentUsers: [],
    reportedContent: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // 관리자 권한 확인
  useEffect(() => {
    const checkAdminAuth = () => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      const user = JSON.parse(currentUser);
      if (user.email !== "admin@degongso.com") {
        toast.error("관리자 권한이 필요합니다.");
        router.push("/");
        return;
      }
    };

    checkAdminAuth();
  }, [router]);

  // 통계 데이터 로드
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);

      // 시뮬레이션 로딩
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 더미 데이터 생성
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const posts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `게시글 ${i + 1}`,
        author: `사용자${i + 1}`,
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        views: Math.floor(Math.random() * 500) + 50,
        likes: Math.floor(Math.random() * 50) + 1,
        reported: Math.random() > 0.8,
      }));

      const comments = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        postId: Math.floor(Math.random() * 20) + 1,
        author: `사용자${Math.floor(Math.random() * 20) + 1}`,
        content: `댓글 내용 ${i + 1}`,
        date: new Date(Date.now() - i * 43200000).toISOString().split("T")[0],
        reported: Math.random() > 0.9,
      }));

      const reportedContent = [
        ...posts.filter((p) => p.reported).map((p) => ({ ...p, type: "post" })),
        ...comments
          .filter((c) => c.reported)
          .map((c) => ({ ...c, type: "comment" })),
      ];

      setStats({
        totalUsers: users.length + 15, // 더미 사용자 추가
        totalPosts: posts.length,
        totalComments: comments.length,
        totalViews: posts.reduce((sum, post) => sum + post.views, 0),
        recentPosts: posts.slice(0, 5),
        recentUsers: users.slice(-5),
        reportedContent: reportedContent.slice(0, 10),
      });

      setIsLoading(false);
    };

    loadStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = "blue" }: any) => (
    <Card className="shadow-sm">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <h3 className="text-lg sm:text-2xl font-bold">{value}</h3>
          </div>
          <Icon
            className={`h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 text-${color}-500`}
          />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">관리자 대시보드 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                관리자 대시보드
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                DEGONGSO 플랫폼 관리 및 통계
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <Link href="/admin/settings" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  설정
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="총 사용자"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="총 게시글"
            value={stats.totalPosts.toLocaleString()}
            icon={FileText}
            color="green"
          />
          <StatCard
            title="총 댓글"
            value={stats.totalComments.toLocaleString()}
            icon={MessageSquare}
            color="purple"
          />
          <StatCard
            title="총 조회수"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            color="orange"
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* 최근 게시글 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                최근 게시글
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {stats.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {post.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {post.author} • {post.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {post.views} 조회
                      </Badge>
                      {post.reported && (
                        <Badge variant="destructive" className="text-xs">
                          신고됨
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Link href="/admin/posts">
                <Button variant="outline" className="w-full" size="sm">
                  모든 게시글 관리
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 최근 사용자 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                최근 가입자
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            {user.nickname}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    최근 가입한 사용자가 없습니다.
                  </p>
                )}
              </div>
              <Separator className="my-4" />
              <Link href="/admin/users">
                <Button variant="outline" className="w-full" size="sm">
                  사용자 관리
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 신고된 콘텐츠 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                신고된 콘텐츠
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {stats.reportedContent.length > 0 ? (
                  stats.reportedContent.map((content) => (
                    <div
                      key={`${content.type}-${content.id}`}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm truncate">
                            {content.type === "post"
                              ? content.title
                              : content.content}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {content.author} • {content.date}
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          {content.type === "post" ? "게시글" : "댓글"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    신고된 콘텐츠가 없습니다.
                  </p>
                )}
              </div>
              <Separator className="my-4" />
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full" size="sm">
                  신고 관리
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* 퀵 액션 */}
        <Card className="shadow-sm mt-4 sm:mt-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">빠른 액션</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/admin/posts">
                <Button
                  variant="outline"
                  className="w-full h-14 sm:h-16 flex flex-col text-xs sm:text-sm"
                >
                  <FileText className="h-4 w-4 sm:h-6 sm:w-6 mb-1" />
                  게시글 관리
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button
                  variant="outline"
                  className="w-full h-14 sm:h-16 flex flex-col text-xs sm:text-sm"
                >
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 mb-1" />
                  사용자 관리
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button
                  variant="outline"
                  className="w-full h-14 sm:h-16 flex flex-col text-xs sm:text-sm"
                >
                  <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 mb-1" />
                  통계 분석
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button
                  variant="outline"
                  className="w-full h-14 sm:h-16 flex flex-col text-xs sm:text-sm"
                >
                  <Settings className="h-4 w-4 sm:h-6 sm:w-6 mb-1" />
                  시스템 설정
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

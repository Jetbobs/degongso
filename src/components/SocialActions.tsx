"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  Copy,
  Facebook,
  Twitter,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface SocialActionsProps {
  postId: number;
  title: string;
  author: string;
  type?: "post" | "comment";
  className?: string;
}

const SocialActions: React.FC<SocialActionsProps> = ({
  postId,
  title,
  author,
  type = "post",
  className = "",
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  // 북마크 상태 확인
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(postId));
  }, [postId]);

  // 북마크 토글
  const handleBookmark = async () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((id: number) => id !== postId);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      setIsBookmarked(false);
      toast.success("북마크가 제거되었습니다.");
    } else {
      const newBookmarks = [...bookmarks, postId];
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      setIsBookmarked(true);
      toast.success("북마크에 추가되었습니다.");
    }
  };

  // 공유 기능
  const handleShare = async (platform?: string) => {
    const url = `${window.location.origin}/board/${postId}`;
    const text = `${title} - DEGONGSO`;

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("링크가 복사되었습니다.");
      } catch (error) {
        toast.error("링크 복사에 실패했습니다.");
      }
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: text,
          url: url,
        });
      } catch (error) {
        // 사용자가 공유를 취소했거나 오류 발생
        console.log("공유 취소 또는 오류:", error);
      }
    } else {
      // Web Share API를 지원하지 않는 경우 링크 복사
      handleShare("copy");
    }
  };

  // 신고 기능
  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error("신고 사유를 입력해주세요.");
      return;
    }

    setIsReporting(true);

    // 신고 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const reports = JSON.parse(localStorage.getItem("reports") || "[]");
    const newReport = {
      id: Date.now(),
      type,
      postId,
      title,
      author,
      reason: reportReason,
      reportedBy: "익명",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    reports.push(newReport);
    localStorage.setItem("reports", JSON.stringify(reports));

    setIsReporting(false);
    setReportReason("");
    toast.success("신고가 접수되었습니다.");
  };

  const reportReasons = [
    "스팸/도배",
    "욕설/비방",
    "음란물",
    "광고",
    "저작권 침해",
    "개인정보 노출",
    "기타",
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* 북마크 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={`flex items-center gap-1 ${
          isBookmarked ? "text-yellow-600" : "text-gray-500"
        }`}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {isBookmarked ? "북마크됨" : "북마크"}
        </span>
      </Button>

      {/* 공유 버튼 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">공유</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShare("copy")}>
            <Copy className="h-4 w-4 mr-2" />
            링크 복사
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleShare("facebook")}>
            <Facebook className="h-4 w-4 mr-2" />
            Facebook에 공유
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("twitter")}>
            <Twitter className="h-4 w-4 mr-2" />
            Twitter에 공유
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleShare()}>
            <Share2 className="h-4 w-4 mr-2" />
            다른 앱으로 공유
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 더보기 메뉴 (신고 포함) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 focus:text-red-600"
              >
                <Flag className="h-4 w-4 mr-2" />
                신고하기
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-500" />
                  콘텐츠 신고
                </AlertDialogTitle>
                <AlertDialogDescription>
                  이 {type === "post" ? "게시글" : "댓글"}을 신고하는 이유를
                  선택해주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">신고 사유</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {reportReasons.map((reason) => (
                      <Button
                        key={reason}
                        variant={
                          reportReason === reason ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setReportReason(reason)}
                        className="justify-start"
                      >
                        {reason}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="detail">상세 설명 (선택사항)</Label>
                  <Textarea
                    id="detail"
                    placeholder="신고 사유에 대한 자세한 설명을 입력해주세요."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setReportReason("")}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReport}
                  disabled={!reportReason || isReporting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isReporting ? "신고 중..." : "신고하기"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SocialActions;

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  BellRing,
  MessageSquare,
  ThumbsUp,
  UserPlus,
  Bookmark,
  X,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Notification } from "@/types";
import Link from "next/link";

interface NotificationSystemProps {
  className?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  className = "",
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 알림 로드
  const loadNotifications = useCallback(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    setNotifications(savedNotifications);

    const unread = savedNotifications.filter(
      (n: Notification) => !n.isRead
    ).length;
    setUnreadCount(unread);
  }, []);

  // 실시간 알림 시뮬레이션
  const simulateRealTimeNotifications = useCallback(() => {
    const notificationTypes = [
      { type: "like", message: "누군가가 당신의 게시글을 좋아합니다!" },
      { type: "comment", message: "새로운 댓글이 달렸습니다." },
      { type: "reply", message: "당신의 댓글에 답글이 달렸습니다." },
      { type: "system", message: "새로운 업데이트가 있습니다." },
    ];

    // 랜덤하게 알림 생성 (5-15초 간격)
    const interval = setInterval(() => {
      // 20% 확률로 알림 생성
      if (Math.random() > 0.8) {
        const randomNotification =
          notificationTypes[
            Math.floor(Math.random() * notificationTypes.length)
          ];

        const newNotification: Notification = {
          id: Date.now(),
          userId: 1,
          type: randomNotification.type as
            | "like"
            | "comment"
            | "reply"
            | "system",
          message: randomNotification.message,
          isRead: false,
          createdAt: new Date().toISOString(),
          postId: Math.floor(Math.random() * 10) + 1,
        };

        const existingNotifications = JSON.parse(
          localStorage.getItem("notifications") || "[]"
        );
        const updatedNotifications = [
          newNotification,
          ...existingNotifications,
        ].slice(0, 20); // 최대 20개 유지

        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications)
        );

        // 실시간 업데이트
        setNotifications(updatedNotifications);
        setUnreadCount((prev) => prev + 1);

        // 토스트 알림
        toast.info(randomNotification.message, {
          duration: 3000,
        });
      }
    }, Math.random() * 10000 + 5000); // 5-15초 간격

    return () => clearInterval(interval);
  }, []);

  // localStorage 변경 감지
  useEffect(() => {
    loadNotifications();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "notifications") {
        loadNotifications();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 실시간 알림 시뮬레이션 시작
    const cleanup = simulateRealTimeNotifications();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      cleanup();
    };
  }, [loadNotifications, simulateRealTimeNotifications]);

  // 알림 읽음 처리
  const markAsRead = (notificationId: number) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );

    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      isRead: true,
    }));

    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    setUnreadCount(0);
  };

  // 알림 삭제
  const deleteNotification = (notificationId: number) => {
    const updatedNotifications = notifications.filter(
      (n) => n.id !== notificationId
    );

    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  // 알림 아이콘 결정
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4 text-blue-500" />;
      case "comment":
      case "reply":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "system":
        return <Bell className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // 상대적 시간 계산
  const getRelativeTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`relative ${className}`}>
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">알림</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              모두 읽음
            </Button>
          )}
        </div>

        {/* 알림 목록 */}
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            새로운 알림이 없습니다
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0 focus:bg-gray-50"
                onSelect={(e) => e.preventDefault()}
              >
                <div
                  className={`w-full p-3 cursor-pointer hover:bg-gray-50 ${
                    !notification.isRead
                      ? "bg-blue-50 border-l-2 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                    if (notification.postId) {
                      setIsOpen(false);
                      // 게시글로 이동하는 로직은 Link 컴포넌트를 사용하거나 router.push 사용
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notification.isRead ? "font-medium" : ""
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {/* 더보기 링크 */}
        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/notifications"
                className="text-center w-full py-2 text-sm"
              >
                모든 알림 보기
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationSystem;

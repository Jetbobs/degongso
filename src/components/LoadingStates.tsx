"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  MessageCircle,
  Search,
  Loader2,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// 게시글 목록 스켈레톤
export function PostListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <div className="flex items-center gap-2 text-sm">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 게시글 상세 스켈레톤
export function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 댓글 스켈레톤
export function CommentSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 로딩 인디케이터
export function LoadingSpinner({
  text = "로딩 중...",
  size = "default",
}: {
  text?: string;
  size?: "sm" | "default" | "lg";
}) {
  const iconSize =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Loader2 className={`${iconSize} animate-spin`} />
      <span className={`${textSize} text-muted-foreground`}>{text}</span>
    </div>
  );
}

// 빈 게시글 목록
export function EmptyPostList() {
  return (
    <div className="text-center py-12">
      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">게시글이 없습니다</h3>
      <p className="text-muted-foreground mb-6">
        첫 번째 게시글을 작성해보세요!
      </p>
      <Button asChild>
        <a href="/board/write">새 글 작성</a>
      </Button>
    </div>
  );
}

// 빈 검색 결과
export function EmptySearchResult({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="text-center py-12">
      <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
      <p className="text-muted-foreground mb-6">
        <span className="font-medium">'{searchTerm}'</span>에 대한 검색 결과를
        찾을 수 없습니다.
        <br />
        다른 키워드로 검색해보세요.
      </p>
    </div>
  );
}

// 빈 댓글
export function EmptyComments() {
  return (
    <div className="text-center py-8">
      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-semibold mb-2">댓글이 없습니다</h3>
      <p className="text-muted-foreground text-sm">
        첫 번째 댓글을 남겨보세요!
      </p>
    </div>
  );
}

// 이미지 로딩 상태
export function ImageWithLoading({
  src,
  alt,
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {hasError ? (
        <div className="flex items-center justify-center bg-muted rounded h-48 w-full">
          <div className="text-center">
            <ImageOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              이미지를 불러올 수 없습니다
            </p>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300 ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}

// 버튼 로딩 상태
export function LoadingButton({
  children,
  isLoading = false,
  loadingText = "처리 중...",
  ...props
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

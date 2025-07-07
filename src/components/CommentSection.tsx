"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  CommentSkeleton,
  EmptyComments,
  LoadingButton,
} from "@/components/LoadingStates";

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  parentId?: number; // 대댓글의 부모 댓글 ID
}

interface CommentSectionProps {
  postId: string | number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      postId: Number(postId),
      author: "익명",
      content: "정말 유용한 정보네요! 감사합니다.",
      date: "2024-01-16",
    },
    {
      id: 2,
      postId: Number(postId),
      author: "개발자",
      content: "저도 동감입니다! 특히 Turbopack 기능이 기대되네요.",
      date: "2024-01-16",
      parentId: 1, // 첫 번째 댓글의 대댓글
    },
    {
      id: 3,
      postId: Number(postId),
      author: "프론트엔드",
      content:
        "App Router도 정말 혁신적이라고 생각해요! 개발 경험이 훨씬 좋아졌네요.",
      date: "2024-01-16",
      parentId: 1, // 첫 번째 댓글의 대댓글
    },
  ]);
  const [formData, setFormData] = useState({
    content: "",
  });
  const [replyForms, setReplyForms] = useState<{ [key: number]: boolean }>({});
  const [replyData, setReplyData] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingReply, setSubmittingReply] = useState<{
    [key: number]: boolean;
  }>({});

  // 댓글 불러오기
  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);

      // 로딩 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 800));

      const savedComments = localStorage.getItem(`comments_${postId}`);
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments);
        if (parsedComments.length > 0) {
          setComments(parsedComments);
        }
      }

      setIsLoading(false);
    };

    loadComments();
  }, [postId]);

  // 댓글 저장
  const saveComments = (newComments: Comment[]) => {
    localStorage.setItem(`comments_${postId}`, JSON.stringify(newComments));
    setComments(newComments);
  };

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    // 작성 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newComment: Comment = {
      id: Date.now(),
      postId: Number(postId),
      author: "익명",
      content: formData.content,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedComments = [...comments, newComment];
    saveComments(updatedComments);

    // 폼 초기화
    setFormData({ content: "" });
    setIsSubmitting(false);
    toast.success("댓글이 작성되었습니다!");
  };

  // 대댓글 작성
  const handleReplySubmit = async (parentId: number) => {
    const replyContent = replyData[parentId];

    if (!replyContent?.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setSubmittingReply((prev) => ({ ...prev, [parentId]: true }));

    // 답글 작성 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newReply: Comment = {
      id: Date.now(),
      postId: Number(postId),
      author: "익명",
      content: replyContent,
      date: new Date().toISOString().split("T")[0],
      parentId: parentId,
    };

    const updatedComments = [...comments, newReply];
    saveComments(updatedComments);

    // 답글 폼 초기화 및 숨기기
    setReplyData((prev) => ({ ...prev, [parentId]: "" }));
    setReplyForms((prev) => ({ ...prev, [parentId]: false }));
    setSubmittingReply((prev) => ({ ...prev, [parentId]: false }));
    toast.success("답글이 작성되었습니다!");
  };

  // 댓글 삭제
  const handleDelete = (commentId: number) => {
    // 댓글과 해당 댓글의 모든 대댓글 삭제
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId && comment.parentId !== commentId
    );
    saveComments(updatedComments);
    toast.success("댓글이 삭제되었습니다!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ content: e.target.value });
  };

  const handleReplyChange = (parentId: number, value: string) => {
    setReplyData((prev) => ({ ...prev, [parentId]: value }));
  };

  const toggleReplyForm = (commentId: number) => {
    setReplyForms((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // 최상위 댓글과 대댓글 분리
  const parentComments = comments.filter((comment) => !comment.parentId);
  const getReplies = (parentId: number) =>
    comments.filter((comment) => comment.parentId === parentId);

  // 댓글을 재귀적으로 렌더링하는 컴포넌트
  const renderComment = (comment: Comment, level: number = 0) => {
    const replies = getReplies(comment.id);
    const isParent = level === 0;

    return (
      <div className={level > 0 ? "ml-8" : ""}>
        <Card
          className={`shadow-none border-none rounded-none ${
            level > 0 ? "!py-0" : "!pt-0"
          }`}
        >
          <CardContent
            className={`mx-6 border-t border-b ${
              level > 0 ? "!bg-gray-50 !px-2 !py-0" : "px-0 py-4"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {level > 0 ? "↳ " : ""}
                  {comment.author}
                </span>
                <span>{comment.date}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-none text-xs h-7 px-2"
                  onClick={() => toggleReplyForm(comment.id)}
                >
                  답글
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-none text-xs h-7 px-2"
                    >
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-4 max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isParent ? "댓글을" : "답글을"} 삭제하시겠습니까?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다.{" "}
                        {isParent ? "댓글과 모든 답글이" : "답글이"} 영구적으로
                        삭제됩니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() => handleDelete(comment.id)}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        삭제
                      </AlertDialogAction>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="text-sm whitespace-pre-wrap">{comment.content}</div>

            {/* 답글 작성 폼 */}
            {replyForms[comment.id] && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <Label className="text-sm">답글 작성</Label>
                  <Textarea
                    value={replyData[comment.id] || ""}
                    onChange={(e) =>
                      handleReplyChange(comment.id, e.target.value)
                    }
                    placeholder="답글을 입력하세요"
                    className="shadow-none rounded-none min-h-[80px]"
                  />
                  <div className="flex gap-2 justify-end">
                    <LoadingButton
                      type="button"
                      size="sm"
                      onClick={() => handleReplySubmit(comment.id)}
                      className="shadow-none"
                      isLoading={submittingReply[comment.id]}
                      loadingText="작성 중..."
                    >
                      답글 작성
                    </LoadingButton>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReplyForm(comment.id)}
                      className="shadow-none"
                      disabled={submittingReply[comment.id]}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 해당 댓글의 답글들을 재귀적으로 렌더링 */}
        {replies.map((reply, index) => (
          <div
            key={reply.id}
            className={index < replies.length - 1 ? "mb-4" : ""}
          >
            {renderComment(reply, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Separator />

      {/* 댓글 작성 폼 */}
      <Card className="shadow-none rounded-none border-t border-b">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base">댓글({comments.length})</CardTitle>
        </CardHeader>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <CommentSkeleton count={3} />
          ) : parentComments.length > 0 ? (
            parentComments.map((comment) => (
              <div key={comment.id}>{renderComment(comment)}</div>
            ))
          ) : (
            <EmptyComments />
          )}
        </div>

        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment-content">내용</Label>
              <Textarea
                id="comment-content"
                value={formData.content}
                onChange={handleChange}
                placeholder="댓글을 입력하세요"
                className="shadow-none rounded-none min-h-[100px]"
                required
              />
            </div>
            <div className="flex justify-end">
              <LoadingButton
                type="submit"
                className="shadow-none"
                isLoading={isSubmitting}
                loadingText="작성 중..."
              >
                댓글 작성
              </LoadingButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

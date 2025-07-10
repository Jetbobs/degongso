// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  password?: string; // 로그인 시에만 필요
  createdAt: string;
  role?: "admin" | "user";
}

// 게시글 관련 타입
export interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  content: string;
  lastModified?: string;
  category?: string;
  tags?: string[];
  fileUrls?: string[];
  isBookmarked?: boolean;
}

// 댓글 관련 타입
export interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  parentId?: number;
  likes?: number;
  isReported?: boolean;
}

// 폼 데이터 타입
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

export interface PostFormData {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface CommentFormData {
  content: string;
}

// 검색 관련 타입
export interface SearchParams {
  query: string;
  type: "title" | "content" | "author" | "all";
  category?: string;
  sortBy?: "date" | "views" | "likes";
  sortOrder?: "asc" | "desc";
}

// 페이지네이션 타입
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 에러 타입
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  timestamp?: string;
}

// 알림 타입
export interface Notification {
  id: number;
  userId: number;
  type: "like" | "comment" | "reply" | "system";
  message: string;
  isRead: boolean;
  createdAt: string;
  postId?: number;
  commentId?: number;
}

// 파일 업로드 타입
export interface FileUpload {
  file: File;
  preview?: string;
  uploading: boolean;
  progress: number;
  error?: string;
  url?: string;
}

// 통계 타입
export interface Statistics {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  totalViews: number;
  recentPosts: Post[];
  popularPosts: Post[];
}

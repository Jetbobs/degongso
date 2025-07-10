import { AppError, ApiResponse } from "@/types";
import { toast } from "sonner";

// 에러 타입 정의
export enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTH_ERROR = "AUTH_ERROR",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// 에러 메시지 매핑
const ERROR_MESSAGES = {
  [ErrorType.NETWORK_ERROR]: "네트워크 연결을 확인해주세요.",
  [ErrorType.VALIDATION_ERROR]: "입력값을 확인해주세요.",
  [ErrorType.AUTH_ERROR]: "로그인이 필요합니다.",
  [ErrorType.NOT_FOUND]: "요청한 리소스를 찾을 수 없습니다.",
  [ErrorType.SERVER_ERROR]: "서버에서 오류가 발생했습니다.",
  [ErrorType.UNKNOWN_ERROR]: "알 수 없는 오류가 발생했습니다.",
};

// 에러 생성 함수
export const createError = (
  type: ErrorType,
  message?: string,
  statusCode?: number
): AppError => ({
  message: message || ERROR_MESSAGES[type],
  code: type,
  statusCode,
  timestamp: new Date().toISOString(),
});

// 에러 처리 함수
export const handleError = (
  error: unknown,
  showToast: boolean = true
): AppError => {
  let appError: AppError;

  if (error instanceof Error) {
    // 네트워크 에러 감지
    if (error.name === "NetworkError" || error.message.includes("fetch")) {
      appError = createError(ErrorType.NETWORK_ERROR, error.message);
    } else {
      appError = createError(ErrorType.UNKNOWN_ERROR, error.message);
    }
  } else if (typeof error === "string") {
    appError = createError(ErrorType.UNKNOWN_ERROR, error);
  } else {
    appError = createError(ErrorType.UNKNOWN_ERROR);
  }

  // 에러 로깅
  console.error("Error handled:", appError);

  // 토스트 메시지 표시
  if (showToast) {
    toast.error(appError.message);
  }

  return appError;
};

// 재시도 함수
export const retryWithDelay = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay * 2); // 지수 백오프
    }
    throw error;
  }
};

// API 응답 검증 함수
export const validateApiResponse = <T>(response: any): ApiResponse<T> => {
  if (!response || typeof response !== "object") {
    throw createError(ErrorType.SERVER_ERROR, "유효하지 않은 응답");
  }

  if (!response.success) {
    throw createError(
      ErrorType.SERVER_ERROR,
      response.message || "서버 오류가 발생했습니다."
    );
  }

  return response as ApiResponse<T>;
};

// 입력값 검증 함수
export const validateInput = (
  value: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => boolean;
  }
): string | null => {
  const { required, minLength, maxLength, pattern, customValidator } = rules;

  if (required && !value.trim()) {
    return "필수 입력 항목입니다.";
  }

  if (minLength && value.length < minLength) {
    return `최소 ${minLength}자 이상 입력해주세요.`;
  }

  if (maxLength && value.length > maxLength) {
    return `최대 ${maxLength}자까지 입력 가능합니다.`;
  }

  if (pattern && !pattern.test(value)) {
    return "올바른 형식으로 입력해주세요.";
  }

  if (customValidator && !customValidator(value)) {
    return "유효하지 않은 값입니다.";
  }

  return null;
};

// 이메일 검증 함수
export const validateEmail = (email: string): string | null => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return validateInput(email, {
    required: true,
    pattern: emailPattern,
  });
};

// 비밀번호 검증 함수
export const validatePassword = (password: string): string | null => {
  const result = validateInput(password, {
    required: true,
    minLength: 6,
    maxLength: 50,
  });

  if (result) return result;

  // 추가 비밀번호 규칙 검증
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return "비밀번호는 대소문자와 숫자를 포함해야 합니다.";
  }

  return null;
};

// 전역 에러 핸들러 설정
export const setupGlobalErrorHandler = () => {
  // 전역 에러 핸들러
  window.addEventListener("error", (event) => {
    const error = createError(
      ErrorType.UNKNOWN_ERROR,
      event.error?.message || "알 수 없는 오류가 발생했습니다."
    );
    console.error("Global error:", error);

    // 심각한 에러의 경우 사용자에게 알림
    if (!event.error?.message?.includes("ResizeObserver")) {
      toast.error(error.message);
    }
  });

  // Promise rejection 핸들러
  window.addEventListener("unhandledrejection", (event) => {
    const error = createError(
      ErrorType.UNKNOWN_ERROR,
      event.reason?.message || "처리되지 않은 Promise 오류가 발생했습니다."
    );
    console.error("Unhandled promise rejection:", error);

    // 사용자에게 알림
    toast.error(error.message);

    // 기본 동작 방지
    event.preventDefault();
  });
};

// 페이지 로드 시 에러 핸들러 설정
if (typeof window !== "undefined") {
  setupGlobalErrorHandler();
}

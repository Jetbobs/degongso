import {
  createError,
  handleError,
  validateInput,
  validateEmail,
  validatePassword,
  ErrorType,
} from "@/lib/errorHandler";

// 간단한 테스트 프레임워크
function describe(name: string, fn: () => void) {
  console.log(`\n🧪 ${name}`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.error(`     ${error}`);
  }
}

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual: (expected: any) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(
            actual
          )}`
        );
      }
    },
    toBeNull: () => {
      if (actual !== null) {
        throw new Error(`Expected null, but got ${actual}`);
      }
    },
    toContain: (expected: string) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
  };
}

// createError 함수 테스트
describe("createError", () => {
  it("기본 메시지로 에러를 생성한다", () => {
    const error = createError(ErrorType.NETWORK_ERROR);
    expect(error.code).toBe(ErrorType.NETWORK_ERROR);
    expect(error.message).toBe("네트워크 연결을 확인해주세요.");
    expect(typeof error.timestamp).toBe("string");
  });

  it("커스텀 메시지로 에러를 생성한다", () => {
    const customMessage = "커스텀 에러 메시지";
    const error = createError(ErrorType.VALIDATION_ERROR, customMessage);
    expect(error.message).toBe(customMessage);
    expect(error.code).toBe(ErrorType.VALIDATION_ERROR);
  });

  it("상태 코드와 함께 에러를 생성한다", () => {
    const error = createError(ErrorType.SERVER_ERROR, undefined, 500);
    expect(error.statusCode).toBe(500);
  });
});

// validateInput 함수 테스트
describe("validateInput", () => {
  it("필수 입력값이 비어있을 때 에러를 반환한다", () => {
    const result = validateInput("", { required: true });
    expect(result).toBe("필수 입력 항목입니다.");
  });

  it("최소 길이보다 짧을 때 에러를 반환한다", () => {
    const result = validateInput("ab", { minLength: 3 });
    expect(result).toBe("최소 3자 이상 입력해주세요.");
  });

  it("최대 길이보다 길 때 에러를 반환한다", () => {
    const result = validateInput("abcdefg", { maxLength: 5 });
    expect(result).toBe("최대 5자까지 입력 가능합니다.");
  });

  it("패턴이 맞지 않을 때 에러를 반환한다", () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = validateInput("invalid-email", { pattern: emailPattern });
    expect(result).toBe("올바른 형식으로 입력해주세요.");
  });

  it("모든 검증을 통과하면 null을 반환한다", () => {
    const result = validateInput("valid@email.com", {
      required: true,
      minLength: 5,
      maxLength: 50,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    });
    expect(result).toBeNull();
  });
});

// validateEmail 함수 테스트
describe("validateEmail", () => {
  it("유효한 이메일에 대해 null을 반환한다", () => {
    const result = validateEmail("test@example.com");
    expect(result).toBeNull();
  });

  it("빈 이메일에 대해 에러를 반환한다", () => {
    const result = validateEmail("");
    expect(result).toBe("필수 입력 항목입니다.");
  });

  it("잘못된 형식의 이메일에 대해 에러를 반환한다", () => {
    const result = validateEmail("invalid-email");
    expect(result).toBe("올바른 형식으로 입력해주세요.");
  });

  it("@가 없는 이메일에 대해 에러를 반환한다", () => {
    const result = validateEmail("testexample.com");
    expect(result).toBe("올바른 형식으로 입력해주세요.");
  });

  it("도메인이 없는 이메일에 대해 에러를 반환한다", () => {
    const result = validateEmail("test@");
    expect(result).toBe("올바른 형식으로 입력해주세요.");
  });
});

// validatePassword 함수 테스트
describe("validatePassword", () => {
  it("유효한 비밀번호에 대해 null을 반환한다", () => {
    const result = validatePassword("Test123!");
    expect(result).toBeNull();
  });

  it("빈 비밀번호에 대해 에러를 반환한다", () => {
    const result = validatePassword("");
    expect(result).toBe("필수 입력 항목입니다.");
  });

  it("너무 짧은 비밀번호에 대해 에러를 반환한다", () => {
    const result = validatePassword("Aa1");
    expect(result).toBe("최소 6자 이상 입력해주세요.");
  });

  it("대문자가 없는 비밀번호에 대해 에러를 반환한다", () => {
    const result = validatePassword("test123");
    expect(result).toBe("비밀번호는 대소문자와 숫자를 포함해야 합니다.");
  });

  it("소문자가 없는 비밀번호에 대해 에러를 반환한다", () => {
    const result = validatePassword("TEST123");
    expect(result).toBe("비밀번호는 대소문자와 숫자를 포함해야 합니다.");
  });

  it("숫자가 없는 비밀번호에 대해 에러를 반환한다", () => {
    const result = validatePassword("TestAbc");
    expect(result).toBe("비밀번호는 대소문자와 숫자를 포함해야 합니다.");
  });
});

// handleError 함수 테스트
describe("handleError", () => {
  it("Error 객체를 올바르게 처리한다", () => {
    const testError = new Error("테스트 에러");
    const result = handleError(testError, false); // 토스트 비활성화

    expect(result.message).toBe("테스트 에러");
    expect(result.code).toBe(ErrorType.UNKNOWN_ERROR);
  });

  it("문자열 에러를 올바르게 처리한다", () => {
    const result = handleError("문자열 에러", false);

    expect(result.message).toBe("문자열 에러");
    expect(result.code).toBe(ErrorType.UNKNOWN_ERROR);
  });

  it("알 수 없는 에러 타입을 처리한다", () => {
    const result = handleError(123, false);

    expect(result.message).toBe("알 수 없는 오류가 발생했습니다.");
    expect(result.code).toBe(ErrorType.UNKNOWN_ERROR);
  });

  it("네트워크 에러를 감지한다", () => {
    const networkError = new Error("fetch failed");
    const result = handleError(networkError, false);

    expect(result.code).toBe(ErrorType.NETWORK_ERROR);
  });
});

// 테스트 실행
console.log("🔧 ErrorHandler 유틸리티 테스트 시작...\n");

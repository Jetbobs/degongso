import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import SocialActions from "@/components/SocialActions";

// sonner 모킹
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// localStorage 모킹
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// navigator.clipboard 모킹
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe("SocialActions", () => {
  const defaultProps = {
    postId: 1,
    title: "테스트 게시글",
    author: "테스트 작성자",
    type: "post" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("[]");
  });

  it("컴포넌트가 올바르게 렌더링된다", () => {
    render(<SocialActions {...defaultProps} />);

    expect(screen.getByText("북마크")).toBeInTheDocument();
    expect(screen.getByText("공유")).toBeInTheDocument();
  });

  it("북마크 버튼을 클릭하면 북마크가 추가된다", async () => {
    render(<SocialActions {...defaultProps} />);

    const bookmarkButton = screen.getByText("북마크");
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "bookmarks",
        JSON.stringify([1])
      );
      expect(toast.success).toHaveBeenCalledWith("북마크에 추가되었습니다.");
    });
  });

  it("이미 북마크된 게시글의 북마크를 해제할 수 있다", async () => {
    localStorageMock.getItem.mockReturnValue("[1]");

    render(<SocialActions {...defaultProps} />);

    const bookmarkButton = screen.getByText("북마크됨");
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "bookmarks",
        JSON.stringify([])
      );
      expect(toast.success).toHaveBeenCalledWith("북마크가 제거되었습니다.");
    });
  });

  it("공유 메뉴에서 링크 복사가 작동한다", async () => {
    render(<SocialActions {...defaultProps} />);

    const shareButton = screen.getByText("공유");
    fireEvent.click(shareButton);

    const copyLinkButton = screen.getByText("링크 복사");
    fireEvent.click(copyLinkButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}/board/1`
      );
      expect(toast.success).toHaveBeenCalledWith("링크가 복사되었습니다.");
    });
  });

  it("신고 기능이 작동한다", async () => {
    render(<SocialActions {...defaultProps} />);

    // 더보기 메뉴 클릭
    const moreButton = screen.getByRole("button", { name: "" });
    fireEvent.click(moreButton);

    // 신고하기 클릭
    const reportButton = screen.getByText("신고하기");
    fireEvent.click(reportButton);

    // 신고 사유 선택
    const spamButton = screen.getByText("스팸/도배");
    fireEvent.click(spamButton);

    // 신고하기 버튼 클릭
    const submitButton = screen.getByRole("button", { name: "신고하기" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("신고가 접수되었습니다.");
    });
  });

  it("신고 시 사유가 선택되지 않으면 에러 메시지가 표시된다", async () => {
    render(<SocialActions {...defaultProps} />);

    // 더보기 메뉴 클릭
    const moreButton = screen.getByRole("button", { name: "" });
    fireEvent.click(moreButton);

    // 신고하기 클릭
    const reportButton = screen.getByText("신고하기");
    fireEvent.click(reportButton);

    // 사유 선택 없이 신고하기 버튼 클릭
    const submitButton = screen.getByRole("button", { name: "신고하기" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("신고 사유를 입력해주세요.");
    });
  });
});

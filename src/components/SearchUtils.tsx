"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Clock, Trash2 } from "lucide-react";

// 텍스트 하이라이팅 컴포넌트
export function HighlightText({
  text,
  searchTerm,
  className = "",
}: {
  text: string;
  searchTerm: string;
  className?: string;
}) {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

// 최근 검색어 관리 훅
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addSearch = (term: string) => {
    if (!term.trim()) return;

    const trimmedTerm = term.trim();
    const updatedSearches = [
      trimmedTerm,
      ...recentSearches.filter((search) => search !== trimmedTerm),
    ].slice(0, 10); // 최대 10개까지 저장

    setRecentSearches(updatedSearches);
    localStorage.setItem("recent_searches", JSON.stringify(updatedSearches));
  };

  const removeSearch = (term: string) => {
    const updatedSearches = recentSearches.filter((search) => search !== term);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recent_searches", JSON.stringify(updatedSearches));
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_searches");
  };

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAllSearches,
  };
}

// 향상된 검색 입력 컴포넌트
export function EnhancedSearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "제목, 내용, 작성자로 검색...",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addSearch, removeSearch, clearAllSearches } =
    useRecentSearches();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      addSearch(value.trim());
      onSearch(value.trim());
      setIsOpen(false);
    }
  };

  const handleRecentSearchClick = (term: string) => {
    onChange(term);
    onSearch(term);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    if (recentSearches.length > 0) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    onChange("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // 클릭 이벤트가 발생할 시간을 줌
          placeholder={placeholder}
          className="pl-10 pr-20 shadow-none text-xs md:text-sm truncate"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </form>

      {/* 최근 검색어 드롭다운 */}
      {isOpen && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-50 p-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-3 w-3" />
                최근 검색어
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllSearches}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                전체 삭제
              </Button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((term, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between group rounded-md px-2 py-1.5 hover:bg-muted cursor-pointer"
                  onClick={() => handleRecentSearchClick(term)}
                >
                  <span className="text-sm truncate flex-1">{term}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(term);
                    }}
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 검색 통계 컴포넌트
export function SearchStats({
  totalCount,
  filteredCount,
  searchTerm,
  searchType = "all",
}: {
  totalCount: number;
  filteredCount: number;
  searchTerm: string;
  searchType?: string;
}) {
  if (!searchTerm.trim()) {
    return (
      <div className="text-sm text-muted-foreground">
        총 {totalCount}개 게시글
      </div>
    );
  }

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "title":
        return "제목";
      case "content":
        return "내용";
      case "author":
        return "작성자";
      case "all":
      default:
        return "전체";
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>
        <span className="font-medium text-foreground">'{searchTerm}'</span>{" "}
        {getSearchTypeLabel()} 검색 결과:
        <span className="font-medium text-foreground ml-1">
          {filteredCount}개
        </span>
        <span className="mx-1">·</span>
        전체 {totalCount}개
      </span>
      {filteredCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {Math.round((filteredCount / totalCount) * 100)}% 일치
        </Badge>
      )}
    </div>
  );
}

"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Menu, Shield, User, LogOut, Settings, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NotificationSystem from "./NotificationSystem";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // 현재 사용자 정보 확인
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setIsAdmin(parsedUser.email === "admin@degongso.com");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAdmin(false);
    toast.success("로그아웃되었습니다.");
    router.push("/");
  };

  const menuItems = [
    { href: "/", label: "홈" },
    { href: "/board", label: "자유게시판" },
    { href: "/board/jobs", label: "외주구인게시판" },
  ];

  const authItems = currentUser
    ? []
    : [
        { href: "/login", label: "로그인" },
        { href: "/register", label: "회원가입" },
      ];

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/디공소 로고(kr_black).png"
              alt="DEGONGSO"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto dark:hidden"
              priority
            />
            <Image
              src="/logo/디공소 로고(kr_white).png"
              alt="DEGONGSO"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto hidden dark:block"
              priority
            />
          </Link>

          {/* 데스크톱 네비게이션과 토글 */}
          <div className="flex items-center">
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {/* 관리자 메뉴 */}
                {isAdmin && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/admin"
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-blue-600"
                        )}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        관리자
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                {/* 인증되지 않은 사용자용 메뉴 */}
                {authItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {/* 로그인된 사용자 메뉴 */}
                {currentUser && (
                  <NavigationMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          {currentUser.nickname}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/profile"
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            프로필
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/bookmarks"
                            className="flex items-center gap-2"
                          >
                            <Bookmark className="h-4 w-4" />
                            북마크
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/settings"
                            className="flex items-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            설정
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href="/admin"
                                className="flex items-center gap-2 text-blue-600"
                              >
                                <Shield className="h-4 w-4" />
                                관리자 대시보드
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          로그아웃
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </NavigationMenuItem>
                )}

                {/* 알림 시스템 (로그인된 사용자만) */}
                {currentUser && (
                  <NavigationMenuItem>
                    <NotificationSystem />
                  </NavigationMenuItem>
                )}

                <NavigationMenuItem>
                  <ThemeToggle />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* 모바일용 토글과 햄버거 메뉴 */}
            <div className="flex items-center gap-2 md:hidden">
              {/* 모바일 알림 (로그인된 사용자만) */}
              {currentUser && <NotificationSystem />}
              <ThemeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="메뉴 열기">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <SheetHeader>
                    <SheetTitle>메뉴</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-6">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-base font-bold hover:text-primary transition-colors pl-4"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}

                    {/* 관리자 메뉴 (모바일) */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="text-base font-bold hover:text-primary transition-colors pl-4 text-blue-600 flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        관리자
                      </Link>
                    )}

                    {/* 인증 메뉴 */}
                    {currentUser ? (
                      <div className="border-t pt-4 mt-4">
                        <div className="pl-4 mb-2 text-sm text-muted-foreground">
                          {currentUser.nickname}님
                        </div>
                        <Link
                          href="/profile"
                          className="text-base font-bold hover:text-primary transition-colors pl-4 flex items-center gap-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          프로필
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="text-base font-bold hover:text-primary transition-colors pl-4 flex items-center gap-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <Bookmark className="h-4 w-4" />
                          북마크
                        </Link>
                        <Link
                          href="/settings"
                          className="text-base font-bold hover:text-primary transition-colors pl-4 flex items-center gap-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          설정
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="text-base font-bold hover:text-primary transition-colors pl-4 flex items-center gap-2 text-red-600 w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          로그아웃
                        </button>
                      </div>
                    ) : (
                      authItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-base font-bold hover:text-primary transition-colors pl-4"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default Header;

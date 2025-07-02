"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import { Button } from "./ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  Upload,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TiptapEditor = ({
  content,
  onChange,
  placeholder = "내용을 입력하세요...",
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImageFromUrl = () => {
    const url = window.prompt("이미지 URL을 입력하세요");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addImageFromFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          editor.chain().focus().setImage({ src: result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="border rounded-none shadow-none">
      {/* 툴바 */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* 텍스트 스타일 */}
        <Button
          variant={editor.isActive("bold") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("strike") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("code") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 헤딩 */}
        <Button
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "outline"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="h-8 w-8 p-0 shadow-none"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "outline"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="h-8 w-8 p-0 shadow-none"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "outline"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="h-8 w-8 p-0 shadow-none"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 리스트 */}
        <Button
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 링크 */}
        <Button
          variant={editor.isActive("link") ? "default" : "outline"}
          size="sm"
          onClick={setLink}
          className="h-8 w-8 p-0 shadow-none"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 이미지 */}
        <Button
          variant="outline"
          size="sm"
          onClick={addImageFromUrl}
          className="h-8 w-8 p-0 shadow-none"
          title="URL로 이미지 추가"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={addImageFromFile}
          className="h-8 w-8 p-0 shadow-none"
          title="파일에서 이미지 추가"
        >
          <Upload className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 실행취소/재실행 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 p-0 shadow-none"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* 에디터 영역 */}
      <div className="min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;

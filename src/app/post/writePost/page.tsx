"use client";

import router from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

declare global {
  // eslint-disable-next-line no-var, unused-imports/no-unused-vars
  interface Window {
    Quill: any;
  }
}

interface Topic {
  id: string;
  name: string;
}

interface RQProps {
  forwardedRef?: React.Ref<any>;
  [key: string]: any; // Allows other props to be passed in
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    if (typeof window !== "undefined") {
      const Quill = require("quill");
      const ImageResize = require("quill-image-resize-module-react");
      Quill.register("modules/imageResize", ImageResize.default);
      window.Quill = Quill;
    }
    return ({ forwardedRef, ...props }: RQProps) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  { ssr: false }
);

function WritePost() {
  const quillRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [tags, setTags] = useState<string[]>([]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files) {
        const file = input.files[0];
        const formData = new FormData();

        formData.append("image", file);

        const response = await fetch("/api/post/uploadImage", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Image upload failed");
          return;
        }

        const data = await response.json();
        const imageUrl = data.imageUrl;

        const range = (quillRef.current as any)?.getEditor().getSelection(true);
        (quillRef.current as any)
          ?.getEditor()
          .insertEmbed(range.index, "image", imageUrl);
      }
    };
  };

  const handleChange = (html: any) => {
    setContent(html);
  };
  const handleTitleChange = (event: any) => setTitle(event.target.value);
  const handleTagChange = (event: any) => setTag(event.target.value);
  const handleTagClick = (tag: string) => {
    const newArr = [
      ...tags.slice(0, tags.indexOf(tag)),
      ...tags.slice(tags.indexOf(tag) + 1),
    ];
    setTags(newArr);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        modules: ["Resize", "DisplaySize"],
      },
    }),
    []
  );

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <ReactQuill
      forwardedRef={quillRef}
      change
      this
      line
      theme="snow"
      value={content} // Value에 useState 사용해도되지만, onChange에서 useState Set을 사용하면 에러남.
      onChange={handleChange}
      modules={modules}
      formats={formats}
    />
  );
}

export default WritePost;

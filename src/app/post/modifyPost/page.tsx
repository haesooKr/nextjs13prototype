"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import toast from "react-hot-toast";
import styles from "./modifyPost.module.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { BsXCircle } from "react-icons/bs";
import usePostStore from "@/lib/zustand/usePostStore";
import { useRouter } from "next/navigation";

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
    const Quill = require("quill");
    const ImageResize = require("quill-image-resize-module-react");
    Quill.register("modules/imageResize", ImageResize.default);
    window.Quill = Quill;
    return ({ forwardedRef, ...props }: RQProps) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  { ssr: false }
);

function ModifyPost() {
  const router = useRouter();

  const { savedPost, updatePost } = usePostStore((state) => state);

  if (savedPost.id) {
    const postTags = savedPost.postTags.map((tag) => {
      return tag.tag.name;
    });

    const quillRef = useRef(null);

    const [title, setTitle] = useState(savedPost.title);
    const [content, setContent] = useState(savedPost.content);
    const [tag, setTag] = useState("");
    const [selectedTopic, setSelectedTopic] = useState(savedPost.topicId);
    const [topics, setTopics] = useState([]);
    const [tags, setTags] = useState<string[]>(postTags);

    useEffect(() => {
      fetch("/api/post/getTopics")
        .then((res) => res.json())
        .then((data) => setTopics(data.data.topics));
    }, []);

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
          console.log(data);
          const imageUrl = data.data.imageUrl;
          console.log(imageUrl);

          const range = (quillRef.current as any)
            ?.getEditor()
            .getSelection(true);
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
    const handleTagAdd = () => {
      if (tag.length > 10) {
        alert("태그는 최대 10 글자까지 입력 가능합니다.");
        return;
      }

      if (tags.length > 4) {
        setTag("");
        alert("태그는 5개까지 등록이 가능합니다.");
        return;
      }

      if (tags.indexOf(tag) >= 0) {
        setTag("");
        alert("중복된 태그입니다.");
        return;
      }

      setTags([...tags, tag]);
      setTag("");
    };
    const handleTagKeyUp = (event: any) => {
      if (event.key == "Enter") {
        handleTagAdd();
      }
    };

    function extractBase64Images(html) {
      const regex = /src="data:image\/[^;]+;base64,([^"]+)"/g;
      const matches = html.match(regex);
      return matches ? matches.map((match) => match.replace(regex, "$1")) : [];
    }

    function base64toBlob(base64Data, contentType) {
      const sliceSize = 512;
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    }

    async function handleSubmit() {
      var myEditor = document.querySelector(".ql-container");
      var html: string;
      let uploadHtml;

      // title, html, topicId: selectedTopic, tags

      try {
        html = myEditor.children[0].innerHTML;

        const base64Images = extractBase64Images(html);
        console.log(base64Images);

        // Loop through base64Images array and append each image to the FormData
        for (let index = 0; index < base64Images.length; index++) {
          const base64Image = base64Images[index];
          const formData = new FormData();

          // Convert base64 to Blob
          const blob = base64toBlob(base64Image, "image/png");

          // Create a File object from the Blob and append it to FormData
          const imageFile = new File([blob], `image_${index + 1}.png`, {
            type: "image/png",
          });
          formData.append(`image_${index + 1}`, imageFile);

          const response = await fetch("/api/post/uploadImage", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.imageUrl) {
              const uploadedImageUrl = data.data.imageUrl;
              // Modify the HTML to replace the base64 with the uploaded image URL
              html = html.replace(
                `data:image/png;base64,${base64Image}`,
                uploadedImageUrl
              );
              uploadHtml = html;
            } else {
              throw new Error("Image upload fail.");
            }
          } else {
            console.error(
              "Image upload failed:",
              response.status,
              response.statusText
            );
          }
        }

        console.log(uploadHtml);

        const response = await fetch("/api/post/modifyPost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: savedPost.id,
            title,
            html: html,
            topicId: selectedTopic,
            tags,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server Error`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        toast("Post Modify Fail: " + error.message, {
          icon: "⛔",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }

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
      <div className={styles.quillBox}>
        <h1>Write Post</h1>

        <div className={styles.row}>
          <label htmlFor="title">Title:</label>
          <input
            placeholder="제목:"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <Suspense fallback={<p>Loading editor...</p>}>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option value="">주제를 선택해주세요.</option>
              {topics &&
                topics.length > 0 &&
                topics.map((topic: Topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
            </select>
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<p>Loading editor...</p>}>
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
          </Suspense>
        </div>
        {tags && tags.length ? (
          <div>
            {tags.map((tag: string, index: number) => (
              <button key={index} onClick={() => handleTagClick(tag)}>
                <div>{tag}</div>
                <BsXCircle color="white" />
              </button>
            ))}
          </div>
        ) : (
          <></>
        )}
        <div className={styles.row}>
          <input
            placeholder="tag:"
            onChange={handleTagChange}
            value={tag}
            onKeyUp={(e) => {
              handleTagKeyUp(e);
            }}
          />
          <button className={styles.button} onClick={handleTagAdd}>
            <span className="text">Add</span>
          </button>
        </div>

        <button className={styles.button} onClick={handleSubmit}>
          <span className="text">Modify</span>
        </button>
      </div>
    );
  } else {
    useEffect(() => {
      if (!savedPost.id) {
        router.push("/");
      }
    }, [savedPost.id, router]);
  }
}

export default ModifyPost;

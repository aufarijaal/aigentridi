"use client";
import BackToTopButton from "@/components/back-to-top";
import axios from "axios";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import { JsonView } from "react-json-view-lite";
import { useDebounceValue } from "usehooks-ts";

interface ImageData {
  filename: string;
  name: string;
  linkForPreview: string;
  linkForDownload: string;
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [error, setError] = useState<string>("");
  const [errorCategories, setErrorCategories] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [q, setQ] = useDebounceValue("", 500);
  const [selectedCategory, setSelectedCategory] = useState("0");

  async function getImages() {
    setLoading(true);

    try {
      const response = await axios.get("/api/images", {
        params: {
          q,
          category: selectedCategory,
        },
      });

      setImages(
        response.data.images.map((img: any) => ({
          filename: img.url.split("original/")[1],
          name: img.title,
          linkForPreview: img.thumbnail,
          linkForDownload: img.url,
        }))
      );
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getCategories() {
    setLoadingCategories(true);

    try {
      const response = await axios.get("/api/categories");

      setCategories(response.data.categories);
    } catch (error: any) {
      setErrorCategories(error.message);
    } finally {
      setLoadingCategories(false);
    }
  }

  useEffect(() => {
    getImages();
  }, [q, selectedCategory]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto flex flex-col items-center justify-center py-20">
        <div className="h-56 max-w-7xl lg:flex-row flex-col flex lg:justify-around mb-10 items-center w-full">
          <h2 className="text-4xl lg:text-6xl text-center lg:text-left leading-none tracking-tight font-extrabold bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-transparent p-2 max-w-2xl">
            Beautiful AI Generated collection of 3D images
          </h2>
          <img
            className="self-center w-[200px] h-[200px]"
            alt="amethyst"
            src="/amethyst-hero.png"
          />
        </div>

        <div className="max-w-4xl w-full px-4">
          <p className="text-rose-500 text-sm">{error}</p>
        </div>

        <div className="h-24 max-w-7xl w-full flex flex-col gap-4 mt-10">
          <form
            className="flex items-center justify-center w-full px-4"
            onSubmit={(e) => {
              e.preventDefault();
              if(!loading) {
                getImages();
              }
            }}
          >
            <input
              disabled={loading}
              defaultValue={""}
              onInput={(e) => {
                setQ((e.target as any).value)
              }}
              type="text"
              className="input input-bordered input-sm lg:input-md flex-grow"
            />
            <button className="btn bg-primary btn-sm lg:btn-md text-white" disabled={loading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </form>

          <div className="px-4">
            {loadingCategories ? (
              <div className="w-full lg:w-52 h-[48px] skeleton"></div>
            ) : (
              <select
                className="select select-bordered select-sm lg:select-md w-full lg:w-52"
                onChange={(e) => setSelectedCategory(e.target.value)}
                defaultValue={0}
              >
                <option key={0} value={0}>
                  All
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <div
            id="loading-list"
            className="w-full max-w-7xl grid grid-cols-2 place-items-center lg:grid-cols-4 mt-10 gap-y-4"
          >
            {Array.from({ length: 20 }, (_, index) => (
              <div
                className="flex flex-col items-center gap-2 w-max h-max"
                key={index}
              >
                <div className="rounded-xl p-2 w-[200px] h-[200px] skeleton"></div>
                <div className="text-gray-400 text-xs text-center text-wrap h-[10px] w-[100px] skeleton"></div>
              </div>
            ))}
          </div>
        ) : (
          <div
            id="image-list"
            className="w-full max-w-7xl grid grid-cols-2 place-items-center lg:grid-cols-4 mt-10 gap-y-4"
          >
            {images.map((image) => (
              <div
                className="group flex flex-col items-center gap-2 w-max h-max"
                key={image.name}
              >
                <a
                  className="bg-none group-hover:bg-base-200/50 group-active:scale-95 transition rounded-xl p-2 w-[200px] h-[200px] flex items-center justify-center relative"
                  key={image.name}
                  href={image.linkForDownload}
                  download={image.linkForDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" alt={image.name} src={image.linkForPreview} />
                  <img className="absolute top-[55%] opacity-50 blur-lg mix-blend-luminosity left-[55%] transform -translate-x-1/2 -translate-y-1/2" alt={image.name} src={image.linkForPreview} />
                </a>
                <span className="text-gray-400 text-xs text-center text-wrap">
                  {image.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer>
        <div className="container mx-auto flex py-4">
          <div className="flex-grow text-center">
            <p className="text-sm text-gray-500">Made by aufarijaal</p>
          </div>
        </div>
      </footer>

      {/* <BackToTopButton /> */}
    </main>
  );
}

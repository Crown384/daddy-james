"use client";

import { FormEvent, useRef, useState } from "react";

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

type UploadResult = {
  secure_url: string;
  public_id: string;
};

type SignatureResponse = {
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
};

async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "video",
): Promise<UploadResult> {
  const signatureResponse = await fetch("/api/cloudinary/sign", {
    method: "POST",
  });

  if (!signatureResponse.ok) {
    const payload = await signatureResponse.json().catch(() => null);
    throw new Error(payload?.error ?? "Media upload is not configured yet.");
  }

  const signed = (await signatureResponse.json()) as SignatureResponse;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signed.apiKey);
  formData.append("timestamp", String(signed.timestamp));
  formData.append("signature", signed.signature);
  formData.append("folder", signed.folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(payload?.error?.message ?? "Cloudinary upload failed.");
  }

  return payload as UploadResult;
}

function formatSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function BirthdayForm() {
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const hasContent = Boolean(name.trim() || wish.trim() || photo || video);

  function choosePhoto(file: File | null) {
    setError("");

    if (!file) {
      setPhoto(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setError("Please keep your photo under 10 MB.");
      return;
    }

    setPhoto(file);
    setVideo(null);

    if (videoInput.current) {
      videoInput.current.value = "";
    }
  }

  function chooseVideo(file: File | null) {
    setError("");

    if (!file) {
      setVideo(null);
      return;
    }

    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError("Please keep your video under 100 MB.");
      return;
    }

    setVideo(file);
    setPhoto(null);

    if (photoInput.current) {
      photoInput.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!hasContent) {
      setError("Add at least a name, wish, picture or video before sending.");
      return;
    }

    setSubmitting(true);
    setSubmitted(false);

    try {
      let photoUpload: UploadResult | undefined;
      let videoUpload: UploadResult | undefined;

      if (photo) {
        setStatus("Uploading your picture…");
        photoUpload = await uploadToCloudinary(photo, "image");
      } else if (video) {
        setStatus("Uploading your video…");
        videoUpload = await uploadToCloudinary(video, "video");
      }

      setStatus("Adding your message to the birthday book…");

      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          wish: wish.trim() || undefined,
          photoUrl: photoUpload?.secure_url,
          photoPublicId: photoUpload?.public_id,
          videoUrl: videoUpload?.secure_url,
          videoPublicId: videoUpload?.public_id,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "We could not save your birthday wish.");
      }

      setName("");
      setWish("");
      setPhoto(null);
      setVideo(null);

      if (photoInput.current) photoInput.current.value = "";
      if (videoInput.current) videoInput.current.value = "";

      setSubmitted(true);
      setStatus("");
    } catch (submissionError) {
      setStatus("");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full rounded-[1.75rem] border border-white/80 bg-white/82 p-5 shadow-[0_28px_75px_-34px_rgba(41,37,36,0.38)] backdrop-blur-xl sm:rounded-[2rem] sm:p-7">
      <div className="mb-6 sm:mb-7">
        <h2 className="text-2xl font-semibold tracking-[-0.035em] text-stone-950 sm:text-3xl">
          Add your birthday wish
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-stone-500">
          You can send a message on its own, or pair it with one photo or one
          video. Your name is optional.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-stone-700">
            <span>Your name</span>
            <span className="text-xs font-normal text-stone-400">Optional</span>
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="e.g. Stephen"
            className="h-12 w-full rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 text-sm text-stone-950 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Your birthday message
          </span>
          <textarea
            value={wish}
            onChange={(event) => setWish(event.target.value)}
            maxLength={2000}
            rows={5}
            placeholder="Write something from your heart…"
            className="w-full resize-none rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 py-3.5 text-sm leading-6 text-stone-950 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
          />
          <span className="mt-1.5 block text-right text-xs text-stone-400">
            {wish.length}/2000
          </span>
        </label>

        <div>
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-stone-700">
                Add a photo or video
              </p>
              <p className="mt-0.5 text-xs text-stone-400">Choose one</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <label
              className={`cursor-pointer rounded-2xl border border-dashed p-3.5 transition sm:p-4 ${
                photo
                  ? "border-amber-500 bg-amber-50"
                  : "border-stone-300 bg-[#fbfaf7] hover:border-amber-500 hover:bg-amber-50/40"
              }`}
            >
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  choosePhoto(event.target.files?.[0] ?? null)
                }
              />
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-lg">
                ♡
              </span>
              <span className="mt-2.5 block truncate text-sm font-semibold text-stone-800">
                {photo ? photo.name : "Photo"}
              </span>
              <span className="mt-1 block text-[11px] leading-4 text-stone-500 sm:text-xs sm:leading-5">
                {photo
                  ? `${formatSize(photo.size)} · selected`
                  : "Share a picture"}
              </span>
            </label>

            <label
              className={`cursor-pointer rounded-2xl border border-dashed p-3.5 transition sm:p-4 ${
                video
                  ? "border-rose-400 bg-rose-50"
                  : "border-stone-300 bg-[#fbfaf7] hover:border-rose-400 hover:bg-rose-50/50"
              }`}
            >
              <input
                ref={videoInput}
                type="file"
                accept="video/*"
                className="sr-only"
                onChange={(event) =>
                  chooseVideo(event.target.files?.[0] ?? null)
                }
              />
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-lg">
                ▶
              </span>
              <span className="mt-2.5 block truncate text-sm font-semibold text-stone-800">
                {video ? video.name : "Video"}
              </span>
              <span className="mt-1 block text-[11px] leading-4 text-stone-500 sm:text-xs sm:leading-5">
                {video
                  ? `${formatSize(video.size)} · selected`
                  : "Share a short video"}
              </span>
            </label>
          </div>

          {photo || video ? (
            <p className="mt-2 text-xs leading-5 text-stone-500">
              Choosing the other media type will replace this selection.
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        ) : null}

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
            <span className="font-semibold">Sent with love.</span> Your
            contribution is now part of Daddy James&apos; birthday book. ♥
          </div>
        ) : null}

        <p className="flex items-center gap-2 text-xs leading-5 text-stone-500">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          Only Daddy James will see what you send.
        </p>

        <button
          type="submit"
          disabled={submitting || !hasContent}
          className="flex min-h-13 w-full items-center justify-center rounded-2xl bg-stone-950 px-5 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-stone-950/10 transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {submitting
            ? status || "Sending…"
            : "Add to Daddy James’ birthday book"}
        </button>
      </form>
    </div>
  );
}

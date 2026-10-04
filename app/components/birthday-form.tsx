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
      }

      if (video) {
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
    <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_30px_80px_-32px_rgba(41,37,36,0.35)] backdrop-blur-xl sm:p-7">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          Add your own
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-stone-950 sm:text-3xl">
          Leave something for Daddy James
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Every field is optional. Share only what you want.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Your name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="e.g. Stephen"
            className="h-12 w-full rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 text-sm text-stone-950 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Your birthday wish</span>
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

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="cursor-pointer rounded-2xl border border-dashed border-stone-300 bg-[#fbfaf7] p-4 transition hover:border-amber-500 hover:bg-amber-50/40">
            <input
              ref={photoInput}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => choosePhoto(event.target.files?.[0] ?? null)}
            />
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-lg">
              ♡
            </span>
            <span className="mt-3 block text-sm font-semibold text-stone-800">
              {photo ? photo.name : "Add a picture"}
            </span>
            <span className="mt-1 block text-xs leading-5 text-stone-500">
              {photo ? formatSize(photo.size) : "JPG, PNG or other image · up to 10 MB"}
            </span>
          </label>

          <label className="cursor-pointer rounded-2xl border border-dashed border-stone-300 bg-[#fbfaf7] p-4 transition hover:border-amber-500 hover:bg-amber-50/40">
            <input
              ref={videoInput}
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(event) => chooseVideo(event.target.files?.[0] ?? null)}
            />
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-lg">
              ▶
            </span>
            <span className="mt-3 block text-sm font-semibold text-stone-800">
              {video ? video.name : "Add a video"}
            </span>
            <span className="mt-1 block text-xs leading-5 text-stone-500">
              {video ? formatSize(video.size) : "A short birthday video · up to 100 MB"}
            </span>
          </label>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        ) : null}

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
            <span className="font-semibold">Sent with love.</span> Your contribution is now in
            Daddy James&apos; birthday book. ♥
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting || !hasContent}
          className="flex h-13 w-full items-center justify-center rounded-2xl bg-stone-950 px-5 text-sm font-semibold text-white shadow-lg shadow-stone-950/10 transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {submitting ? status || "Sending…" : "Send birthday wish"}
        </button>
      </form>
    </div>
  );
}

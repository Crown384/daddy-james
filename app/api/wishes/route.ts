import { NextRequest, NextResponse } from "next/server";
import {
  createBirthdaySubmission,
  listBirthdaySubmissions,
} from "@/lib/convex";
import type { CreateSubmissionInput } from "@/lib/types";

function optionalText(value: unknown, maxLength: number, label: string) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    throw new Error(`${label} must be text.`);
  }

  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > maxLength) {
    throw new Error(`${label} is too long.`);
  }
  return trimmed;
}

function optionalCloudinaryUrl(value: unknown, label: string) {
  const text = optionalText(value, 1000, label);
  if (!text) return undefined;

  const parsed = new URL(text);
  if (parsed.protocol !== "https:" || parsed.hostname !== "res.cloudinary.com") {
    throw new Error(`${label} must be a Cloudinary URL.`);
  }
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const input: CreateSubmissionInput = {
      name: optionalText(body.name, 80, "Name"),
      wish: optionalText(body.wish, 2000, "Wish"),
      photoUrl: optionalCloudinaryUrl(body.photoUrl, "Photo URL"),
      photoPublicId: optionalText(body.photoPublicId, 300, "Photo public ID"),
      videoUrl: optionalCloudinaryUrl(body.videoUrl, "Video URL"),
      videoPublicId: optionalText(body.videoPublicId, 300, "Video public ID"),
    };

    if (!input.name && !input.wish && !input.photoUrl && !input.videoUrl) {
      return NextResponse.json(
        { error: "Add at least a name, wish, picture or video." },
        { status: 400 },
      );
    }

    const id = await createBirthdaySubmission(input);
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save the birthday wish.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-birthday-token");
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      { error: "Admin access is not configured yet." },
      { status: 503 },
    );
  }

  if (!token || token !== expectedToken) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const submissions = await listBirthdaySubmissions(token);
    return NextResponse.json({ submissions });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to load birthday wishes.",
      },
      { status: 500 },
    );
  }
}

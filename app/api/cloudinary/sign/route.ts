import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured yet." },
      { status: 503 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "daddy-james-birthday";
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signaturePayload).digest("hex");

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName,
    apiKey,
  });
}

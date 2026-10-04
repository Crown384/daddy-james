import { notFound } from "next/navigation";
import { BirthdayAlbum } from "./birthday-album";

export const dynamic = "force-dynamic";

export default async function DaddyJamesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    notFound();
  }

  return <BirthdayAlbum token={token} />;
}

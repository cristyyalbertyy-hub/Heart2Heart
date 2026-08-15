import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { HomeClient } from "../../home-client";

export const dynamic = "force-dynamic";

export default async function JoinByCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect("/chat");
  }

  const { code } = await params;
  return <HomeClient initialCode={code} />;
}

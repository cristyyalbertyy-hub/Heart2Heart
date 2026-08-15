import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect("/chat");
  }

  return <HomeClient />;
}

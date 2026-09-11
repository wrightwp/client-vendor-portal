import { redirect } from "next/navigation";

export default async function LegacyClientDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/groups/${encodeURIComponent(id)}`);
}

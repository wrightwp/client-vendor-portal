import { redirect } from "next/navigation";

export default async function ClientByNumberAliasPage({
  params,
}: {
  params: Promise<{ groupNumber: string }>;
}) {
  const { groupNumber } = await params;
  redirect(`/clients/group/${encodeURIComponent(groupNumber)}`);
}

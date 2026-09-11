import { redirect } from "next/navigation";

export default async function GroupByNumberAliasPage({
  params,
}: {
  params: Promise<{ groupNumber: string }>;
}) {
  const { groupNumber } = await params;
  redirect(`/groups/group/${encodeURIComponent(groupNumber)}`);
}

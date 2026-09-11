import { redirect } from "next/navigation";

export default async function ClientByNpiAliasPage({
  params,
}: {
  params: Promise<{ groupNumber: string }>;
}) {
  const { groupNumber } = await params;
  redirect(`/clients/group/${encodeURIComponent(groupNumber)}`);
}

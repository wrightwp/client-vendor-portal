import { redirect } from "next/navigation";

export default function LegacyClientsRedirectPage() {
  redirect("/groups");
}

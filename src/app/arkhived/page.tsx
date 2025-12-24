import { redirect } from "next/navigation";

export default function Arkhived() {
  redirect("/?authed=1");
}

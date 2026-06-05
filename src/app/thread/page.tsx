import { redirect } from "next/navigation";

// The Thread page is not yet built. Redirect to The Volumes for now.
export default function ThreadPage() {
  redirect("/volumes");
}

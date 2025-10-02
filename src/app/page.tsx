import { redirect } from "next/navigation";

export default function RootPage() {
  const defaultSlug = "Dev-donalds";
  redirect(`/${defaultSlug}`);
}

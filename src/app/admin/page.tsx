import { redirect } from "next/navigation";

/** The admin root is a doorway, not a page: send the owner to the product list. */
export default function AdminIndexPage() {
  redirect("/admin/products");
}

import { createFileRoute } from "@tanstack/react-router";
import { categoryHead } from "@/features/categories/seo";
import { CategoryView } from "./categories.$id";

export const Route = createFileRoute("/uz_/categories/$id")({
  component: UzCategoryRoute,
  head: ({ params }) => categoryHead(params.id, "uz"),
});

function UzCategoryRoute() {
  const { id } = Route.useParams();
  return <CategoryView id={id} />;
}

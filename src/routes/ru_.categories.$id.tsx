import { createFileRoute } from "@tanstack/react-router";
import { categoryHead } from "@/features/categories/seo";
import { CategoryView } from "./categories.$id";

export const Route = createFileRoute("/ru_/categories/$id")({
  component: RuCategoryRoute,
  head: ({ params }) => categoryHead(params.id, "ru"),
});

function RuCategoryRoute() {
  const { id } = Route.useParams();
  return <CategoryView id={id} />;
}

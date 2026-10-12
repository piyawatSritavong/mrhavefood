import { detailRoute } from "@/lib/autopost/detail-page";

const route = detailRoute("articles");
export const generateMetadata = route.generateMetadata;
export default route.Page;

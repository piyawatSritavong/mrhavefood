import { detailRoute } from "@/lib/autopost/detail-page";

const route = detailRoute("reviews");
export const generateMetadata = route.generateMetadata;
export default route.Page;

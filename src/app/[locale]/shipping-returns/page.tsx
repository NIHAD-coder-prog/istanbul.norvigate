import { makeLegalPage } from "@/components/LegalPage";

const { generateMetadata, Page } = makeLegalPage("shipping-returns", "shipping");
export { generateMetadata };
export default Page;

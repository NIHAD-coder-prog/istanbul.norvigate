import { makeLegalPage } from "@/components/LegalPage";

const { generateMetadata, Page } = makeLegalPage("terms", "terms");
export { generateMetadata };
export default Page;

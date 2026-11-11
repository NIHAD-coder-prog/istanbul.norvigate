import { makeFormPage } from "@/components/FormPage";

const { generateMetadata, Page } = makeFormPage({ slug: "travel", kind: "tourism", intro: "travel", title: (d) => d.nav.main[2] });
export { generateMetadata };
export default Page;

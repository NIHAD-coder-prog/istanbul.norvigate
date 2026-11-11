import { makeFormPage } from "@/components/FormPage";

const { generateMetadata, Page } = makeFormPage({ slug: "contact", kind: "contact", intro: "contact", title: (d) => d.nav.contact });
export { generateMetadata };
export default Page;

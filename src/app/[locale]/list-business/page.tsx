import { makeFormPage } from "@/components/FormPage";

const { generateMetadata, Page } = makeFormPage({ slug: "list-business", kind: "listing", intro: "listing", title: (d) => d.nav.list });
export { generateMetadata };
export default Page;

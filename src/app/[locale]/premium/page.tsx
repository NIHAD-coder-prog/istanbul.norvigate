import { makeFormPage } from "@/components/FormPage";

const { generateMetadata, Page } = makeFormPage({ slug: "premium", kind: "premium", intro: "premium", title: (d) => d.nav.main[4], status: { key: "plan", idx: 3 } });
export { generateMetadata };
export default Page;

import { makeFormPage } from "@/components/FormPage";

const { generateMetadata, Page } = makeFormPage({ slug: "translation", kind: "translation", intro: "translation", title: (d) => d.cats[5] });
export { generateMetadata };
export default Page;

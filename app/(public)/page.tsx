import TeethExperience from "@/components/three/TeethExperience";
import { ServicesPreview, WhyUs, Testimonials, Faq, CtaBand } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <TeethExperience />
      <ServicesPreview />
      <WhyUs />
      <Testimonials />
      <Faq />
      <CtaBand />
    </>
  );
}

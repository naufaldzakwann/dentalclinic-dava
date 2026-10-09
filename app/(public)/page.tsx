import TeethExperience from "@/components/three/TeethExperience";
import Reveal from "@/components/Reveal";
import { ServicesPreview, WhyUs, Testimonials, Faq, CtaBand } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <TeethExperience />
      <Reveal>
        <ServicesPreview />
      </Reveal>
      <Reveal delay={80}>
        <WhyUs />
      </Reveal>
      <Reveal delay={80}>
        <Testimonials />
      </Reveal>
      <Reveal delay={80}>
        <Faq />
      </Reveal>
      <Reveal delay={80}>
        <CtaBand />
      </Reveal>
    </>
  );
}

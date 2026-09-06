import HomePageClient from "./page-client";
import Hero from "@/components/layout/Hero";
import ProblemStrip from "@/components/home/ProblemStrip";
import HowItWorks from "@/components/home/HowItWorks";
import Preview from "@/components/home/Preview";
import Testimonials from "@/components/home/Testimonials";
import WhySection from "@/components/home/WhySection";
import FinalCTA from "@/components/home/FinalCTA";

export default function Page() {
  return (
    <HomePageClient>
      <div className="overflow-hidden">
        <Hero />
        <ProblemStrip />
        <HowItWorks />
        <Preview />
        <Testimonials />
        <WhySection />
        <FinalCTA />
      </div>
    </HomePageClient>
  );
}

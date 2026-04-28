// pages/AboutPage.tsx
import DefaultLayout from "../layout/DefaultLayout";
import { ApparelGrid } from "../components/about/ApparelGrid";
import { HeroSection } from "../components/about/Hero";
import { PhilosophySection } from "../components/about/Philosophy";
import { StatsSection } from "../components/about/Stats";
import { TimelineSection } from "../components/about/TimelineSection";
import { VideoStorySection } from "../components/about/VideoStory";
import { CTASection } from "../components/about/CTA";

const AboutPage = () => {
  return (
    <DefaultLayout>
      <HeroSection />
      <PhilosophySection />
      <StatsSection />
      <TimelineSection />
      <ApparelGrid />
      <VideoStorySection />
      <CTASection />
    </DefaultLayout>
  );
};

export default AboutPage;

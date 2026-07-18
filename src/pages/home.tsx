import Hero from "../components/home/Hero";
import DefaultLayout from "../layout/DefaultLayout";
import Marquee from "../components/home/Marquee";
import Testimonial from "../components/home/Testimonial";
import Founder from "../components/home/Founder";
import Consultation from "../components/home/Consultation";
import GenderClothes from "../components/home/GenderClothes";
// import LittleRoyals from "../components/home/LittleRoyals";
import ThreeWaysToOrder from "../components/home/ThreeWaysToOrder";
import Feedback from "../components/home/Feedback";
import FAQ from "../components/home/FAQ";
import SectionReveal from "../components/home/SectionReveal";

const Home = () => {
  return (
    <DefaultLayout>
      {/* Hero loads instantly — no entrance animation */}
      <Hero />

      <SectionReveal amount={0.4}>
        <Marquee />
      </SectionReveal>

      <SectionReveal>
        <GenderClothes />
      </SectionReveal>

      {/* <SectionReveal>
        <LittleRoyals />
      </SectionReveal> */}

      <SectionReveal>
        <ThreeWaysToOrder />
      </SectionReveal>

      <SectionReveal>
        <Founder />
      </SectionReveal>

      <SectionReveal>
        <Testimonial />
      </SectionReveal>

      <SectionReveal>
        <Consultation />
      </SectionReveal>

      <SectionReveal>
        <Feedback />
      </SectionReveal>

      <SectionReveal>
        <FAQ />
      </SectionReveal>
    </DefaultLayout>
  );
};

export default Home;

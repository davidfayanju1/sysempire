import Hero from "../components/home/Hero";
import DefaultLayout from "../layout/DefaultLayout";
// import AboutUs from "../components/home/AboutUs";
import Marquee from "../components/home/Marquee";
import Testimonial from "../components/home/Testimonial";
import Founder from "../components/home/Founder";
import Consultation from "../components/home/Consultation";
import GenderClothes from "../components/home/GenderClothes";
import Feedback from "../components/home/Feedback";
import FAQ from "../components/home/FAQ";

const Home = () => {
  return (
    <DefaultLayout>
      <Hero />
      <Marquee />
      <GenderClothes />
      <Founder />
      <Testimonial />
      <Consultation />
      <Feedback />
      <FAQ />
    </DefaultLayout>
  );
};

export default Home;

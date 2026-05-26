import Hero from "../components/home/Hero";
import DefaultLayout from "../layout/DefaultLayout";
import AboutUs from "../components/home/AboutUs";
import Marquee from "../components/home/Marquee";
import Testimonial from "../components/home/Testimonial";
import Founder from "../components/home/Founder";
import Consultation from "../components/home/Consultation";

const Home = () => {
  return (
    <DefaultLayout>
      <Hero />
      <AboutUs />
      <Marquee />
      <Founder />
      <Consultation />
      <Testimonial />
    </DefaultLayout>
  );
};

export default Home;

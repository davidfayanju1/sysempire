import Hero from "../components/home/Hero";
import DefaultLayout from "../layout/DefaultLayout";
import AboutUs from "../components/home/AboutUs";
import Marquee from "../components/home/Marquee";
import Testimonial from "../components/home/Testimonial";
import Founder from "../components/home/Founder";

const Home = () => {
  return (
    <DefaultLayout>
      <Hero />
      <AboutUs />
      <Marquee />
      <Founder />
      <Testimonial />
    </DefaultLayout>
  );
};

export default Home;

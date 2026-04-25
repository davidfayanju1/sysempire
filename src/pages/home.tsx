import Hero from "../components/home/Hero";
import DefaultLayout from "../layout/DefaultLayout";
import AboutUs from "../components/home/AboutUs";
import Marquee from "../components/home/Marquee";
import Testimonial from "../components/home/Testimonial";

const Home = () => {
  return (
    <DefaultLayout>
      <Hero />
      <AboutUs />
      <Marquee />
      <Testimonial />
    </DefaultLayout>
  );
};

export default Home;

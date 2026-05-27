import Hero from "../components/home/Hero";
import DefaultLayout from "../layout/DefaultLayout";
// import AboutUs from "../components/home/AboutUs";
import Marquee from "../components/home/Marquee";
import Testimonial from "../components/home/Testimonial";
import Founder from "../components/home/Founder";
import Consultation from "../components/home/Consultation";
import GenderClothes from "../components/home/GenderClothes";
import Feedback from "../components/home/Feedback";

const Home = () => {
  return (
    <DefaultLayout>
      <Hero />
      <Marquee />
      <GenderClothes />
      <Founder />
      <Consultation />
      <Testimonial />
      <Feedback />
      {/* <AboutUs /> */}
    </DefaultLayout>
  );
};

export default Home;

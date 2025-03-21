import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import HowItWorks from './sections/HowItWorks';
// import PricingSection from './sections/PricingSection';
import Testimonials from './sections/Testimonials';
import Footer from './sections/Footer';

const Homepage = () => {
  return (
    <div className="space-y-24 pb-16">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      {/* <PricingSection /> */}
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Homepage;
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FeaturedDrinks from "@/components/FeaturedDrinks";
import UpcomingEvents from "@/components/UpcomingEvents";
import VIPSection from "@/components/VIPSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedDrinks />
      <UpcomingEvents />
      <VIPSection />
    </Layout>
  );
};

export default Index;

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/marketing/Hero";
import HowItWorks from "@/components/marketing/HowItWorks";
import FeatureTeaser from "@/components/marketing/FeatureTeaser";
import ReciterMarquee from "@/components/marketing/ReciterMarquee";
import DownloadCTA from "@/components/marketing/DownloadCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeatureTeaser />
        <ReciterMarquee />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}

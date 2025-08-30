import { Navbar } from "@components/landing/navbar";
import { HeroSection } from "@components/landing/hero-section";
import { FeaturesSection } from "@components/landing/features-section";
import { TemplatePreview } from "@components/landing/template-preview";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TemplatePreview />
    </div>
  );
}

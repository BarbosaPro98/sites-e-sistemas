import MotionProvider from "@/components/MotionProvider";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrollProgressDot from "@/components/ScrollProgressDot";
import AboutSection from "@/components/AboutSection";
import TreatmentsSection from "@/components/TreatmentsSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import ClinicGallery from "@/components/ClinicGallery";
import PatientJourney from "@/components/PatientJourney";
import EmergencySection from "@/components/EmergencySection";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQSection";
import LocationSection from "@/components/LocationSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PreviewBanner from "@/components/PreviewBanner";
import { structuredData } from "@/lib/seo";

export default function Home() {
  const ld = structuredData();
  return (
    <MotionProvider>
      <a
        href="#sobre"
        className="sr-only z-[70] bg-accent px-4 py-2 text-primary-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <ScrollProgressDot />
      <main>
        <HeroSection />
        <AboutSection />
        <TreatmentsSection />
        <DifferentialsSection />
        <ClinicGallery />
        <PatientJourney />
        <EmergencySection />
        <TrustSection />
        <FAQSection />
        <LocationSection />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <PreviewBanner />
      {ld && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
    </MotionProvider>
  );
}

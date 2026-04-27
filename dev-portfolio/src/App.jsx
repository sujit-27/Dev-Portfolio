import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import About from "./components/sections/About";
import ContactSection from "./components/sections/Contact";
import HeroSection from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import CustomCursor from "./components/ui/CustomCursor";
import GlobalStyles from "./components/ui/GlobalStyles";

export default function App() {
  return (
    <>
      <CustomCursor />
      <GlobalStyles />
      <Navbar />

      <main>
        <HeroSection />
        <About />
        <Skills />
        <Projects />
        <ContactSection />
      </main>

      <Footer />
      {/* <FunZone />   — Phase 4 */}
      {/* <BackToTop /> — Phase 5 */}
      {/* <KonamiEgg /> — Phase 5 */}
    </>
  )
}
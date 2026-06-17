/* ============================================================
   UTUTU v2 — App composition
   ============================================================ */

function App() {
  const chapters = ["hero", "now", "concept", "scales", "projects", "why-dhu", "director", "join"];
  return (
    <div className="page">
      <TopBar />
      <ScrollProgress />
      <ChapterMarkFixed chapters={chapters} />

      <Hero />
      <SectionNow />
      <SectionConcept />
      <SectionScales />
      <SectionProjects />
      <SectionWhyDHU />
      <SectionDirector />
      <SectionJoin />

      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

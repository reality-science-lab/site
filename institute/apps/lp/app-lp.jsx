/* ============================================================
   現実科学研究所 — App composition
   ============================================================ */
function App() {
  return (
    <div className="page">
      <TopBar />
      <Hero />
      <Concept />
      <Mission />
      <Projects />
      <Values />
      <Contact />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

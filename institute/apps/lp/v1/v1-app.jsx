/* ========== v1 App composition ========== */
const { useState: useV1App, useEffect: useV1AppEffect } = React;

function App() {
  const [editsCount, setEditsCount] = useV1App(0);
  const [noiseOn, setNoiseOn] = useV1App(false);

  function bumpEdit() { setEditsCount(c => c + 1); }
  useV1AppEffect(() => {
    if (editsCount === 0) return;
    setNoiseOn(true);
    const t = setTimeout(() => setNoiseOn(prev => prev), 400);
    return () => clearTimeout(t);
  }, [editsCount]);

  return (
    <div className="page">
      <TopBar />
      <Hero onEdit={bumpEdit} />
      <Concept onEdit={bumpEdit} />
      <Mission onEdit={bumpEdit} />
      <Projects />
      <Values />
      <Contact />
      <Footer />
      <Noise on={noiseOn} />
      <ScanLines on={noiseOn} />
      <Console editsCount={editsCount} noiseOn={noiseOn} onToggleNoise={() => setNoiseOn(v => !v)} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

mport { useEffect, useState } from "react";

export function useNeuralEngineData() {
  const [macroDeskData, setMacro] = useState<any>(null);
  const [psychologyData, setPsychology] = useState<any>(null);
  const [aiSignals, setSignals] = useState<any[]>([]);
  const [technicalAnalysis, setTechnical] = useState<any[]>([]);
  const [predictiveMarkets, setPredictive] = useState<any>(null);
  const [newsSignals] = useState<any[]>([]);
  const [earningsSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/neural-data");
      const data = await res.json();

      setMacro(data.macro);
      setPsychology(data.psychology);
      setSignals(data.signals || []);
      setTechnical(data.technical || []);
      setPredictive(data.predictive);

    } catch (e) {
      console.error("DATA ERROR", e);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    macroDeskData,
    psychologyData,
    aiSignals,
    newsSignals,
    earningsSignals,
    technicalAnalysis,
    predictiveMarkets,
    loading,
    refresh: fetchData,
  };
}
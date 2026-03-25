import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MedicationAnalysis {
  effects: string[];
  adjustments: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  summary: string;
}

export const useMedicationAnalysis = () => {
  const [analysis, setAnalysis] = useState<MedicationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeMedication = async (
    medicationName: string,
    strategy: string,
    skinConcerns: string[]
  ) => {
    if (!medicationName.trim()) return null;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-medication', {
        body: { medicationName, strategy, skinConcerns },
      });

      if (fnError) throw fnError;

      setAnalysis(data);
      return data as MedicationAnalysis;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze medication';
      setError(msg);
      console.error('Medication analysis error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analysis, loading, error, analyzeMedication };
};

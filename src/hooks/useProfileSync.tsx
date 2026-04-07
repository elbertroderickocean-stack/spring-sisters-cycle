import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { UserData } from '@/contexts/UserContext';

export const useProfileSync = (
  userData: UserData,
  updateUserData: (data: Partial<UserData>) => void
) => {
  const { user } = useAuth();

  // Load profile from DB on login
  const loadProfile = useCallback(async () => {
    if (!user) return;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !profile) return;

    // Only load if profile has onboarding data
    if (!profile.onboarding_completed) return;

    updateUserData({
      name: profile.name || '',
      email: profile.email || '',
      ageRange: profile.age_range || '',
      skinType: profile.skin_type || '',
      skinConcerns: profile.skin_concerns || [],
      lastPeriodDate: profile.last_period_date ? new Date(profile.last_period_date) : null,
      cycleLength: profile.cycle_length || 28,
      lifeStage: (profile.life_stage as any) || 'cycle',
      pregnancyMode: profile.pregnancy_mode || false,
      trimester: profile.trimester as any || null,
      dueDate: profile.due_date ? new Date(profile.due_date) : null,
      wiseBloomMode: profile.wise_bloom_mode || false,
      takesHormonalMedication: profile.takes_hormonal_medication || false,
      hormonalMedicationName: profile.hormonal_medication_name || '',
      ownedProducts: profile.owned_products || [],
      checkIn: (profile.check_in_data as any) || undefined,
      customRituals: (profile.custom_rituals as any) || undefined,
    });
  }, [user, updateUserData]);

  // Save profile to DB
  const saveProfile = useCallback(async () => {
    if (!user) return;

    const profileData = {
      name: userData.name,
      email: userData.email,
      age_range: userData.ageRange,
      skin_type: userData.skinType,
      skin_concerns: userData.skinConcerns,
      last_period_date: userData.lastPeriodDate?.toISOString() || null,
      cycle_length: userData.cycleLength,
      life_stage: userData.lifeStage,
      pregnancy_mode: userData.pregnancyMode,
      trimester: userData.trimester,
      due_date: userData.dueDate?.toISOString() || null,
      wise_bloom_mode: userData.wiseBloomMode,
      takes_hormonal_medication: userData.takesHormonalMedication,
      hormonal_medication_name: userData.hormonalMedicationName,
      owned_products: userData.ownedProducts,
      check_in_data: userData.checkIn || {},
      custom_rituals: userData.customRituals || {},
      onboarding_completed: true,
    };

    await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', user.id);
  }, [user, userData]);

  // Load on mount/login
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { saveProfile, loadProfile };
};

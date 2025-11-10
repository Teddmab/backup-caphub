import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingStep, OnboardingProgress } from '../../types';
import CONFIG from '../../constants/config';

interface OnboardingState {
  currentStep: string;
  completedSteps: string[];
  progress: number;
  totalSteps: number;
  isLoading: boolean;
  error: string | null;
  stepData: Record<string, any>;
}

const initialState: OnboardingState = {
  currentStep: CONFIG.ONBOARDING_STEPS[0],
  completedSteps: [],
  progress: 0,
  totalSteps: CONFIG.ONBOARDING_STEPS.length,
  isLoading: false,
  error: null,
  stepData: {},
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<string>) => {
      state.currentStep = action.payload;
    },
    
    completeStep: (state, action: PayloadAction<{
      step: string;
      data?: any;
    }>) => {
      const { step, data } = action.payload;
      
      if (!state.completedSteps.includes(step)) {
        state.completedSteps.push(step);
      }
      
      if (data) {
        state.stepData[step] = data;
      }
      
      state.progress = (state.completedSteps.length / state.totalSteps) * 100;
      
      // Move to next step if not at the end
      const currentIndex = CONFIG.ONBOARDING_STEPS.indexOf(state.currentStep);
      if (currentIndex < CONFIG.ONBOARDING_STEPS.length - 1) {
        state.currentStep = CONFIG.ONBOARDING_STEPS[currentIndex + 1];
      }
    },
    
    goToStep: (state, action: PayloadAction<string>) => {
      const step = action.payload;
      if (CONFIG.ONBOARDING_STEPS.includes(step as any)) {
        state.currentStep = step;
      }
    },
    
    goToNextStep: (state) => {
      const currentIndex = CONFIG.ONBOARDING_STEPS.indexOf(state.currentStep as any);
      if (currentIndex < CONFIG.ONBOARDING_STEPS.length - 1) {
        state.currentStep = CONFIG.ONBOARDING_STEPS[currentIndex + 1];
      }
    },
    
    goToPreviousStep: (state) => {
      const currentIndex = CONFIG.ONBOARDING_STEPS.indexOf(state.currentStep as any);
      if (currentIndex > 0) {
        state.currentStep = CONFIG.ONBOARDING_STEPS[currentIndex - 1];
      }
    },
    
    updateStepData: (state, action: PayloadAction<{
      step: string;
      data: any;
    }>) => {
      const { step, data } = action.payload;
      state.stepData[step] = { ...state.stepData[step], ...data };
    },
    
    setOnboardingProgress: (state, action: PayloadAction<OnboardingProgress>) => {
      const { currentStep, completedSteps, progress } = action.payload;
      state.currentStep = currentStep;
      state.completedSteps = completedSteps;
      state.progress = progress;
    },
    
    completeOnboarding: (state) => {
      state.completedSteps = [...CONFIG.ONBOARDING_STEPS];
      state.progress = 100;
      state.currentStep = 'success';
    },
    
    resetOnboarding: (state) => {
      state.currentStep = CONFIG.ONBOARDING_STEPS[0];
      state.completedSteps = [];
      state.progress = 0;
      state.stepData = {};
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentStep,
  completeStep,
  goToStep,
  goToNextStep,
  goToPreviousStep,
  updateStepData,
  setOnboardingProgress,
  completeOnboarding,
  resetOnboarding,
  setLoading,
  setError,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// Selectors
export const selectOnboarding = (state: { onboarding: OnboardingState }) => state.onboarding;
export const selectCurrentStep = (state: { onboarding: OnboardingState }) => state.onboarding.currentStep;
export const selectOnboardingProgress = (state: { onboarding: OnboardingState }) => state.onboarding.progress;
export const selectCompletedSteps = (state: { onboarding: OnboardingState }) => state.onboarding.completedSteps;
export const selectStepData = (state: { onboarding: OnboardingState }) => state.onboarding.stepData; 
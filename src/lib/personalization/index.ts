export { 
  getUserProfile, 
  getUserProfileCached, 
  getProfileSync,
  clearProfileCache,
  updateUserActivity,
  type UserProfile,
  type IntentType,
  type EngagementLevel,
  type ConversionStage 
} from './profile';

export {
  applyPersonalizationRules,
  getDefaultRules,
  mergeRules,
  type PersonalizationRules,
  type UIVariant,
  type ReadingFlowConfig,
  type PaywallConfig,
  type ChatConfig
} from './rules';

export {
  useUIVariant,
  getVariantForProfile,
  getVariantConfig,
  trackVariantExposure,
  createVariantRouter,
  VARIANTS,
  type UIVariantType,
  type UIVariantConfig
} from './ui-variants';
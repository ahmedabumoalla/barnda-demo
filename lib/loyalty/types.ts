export type LoyaltyProgressIcon = "star" | "cup" | "gift" | "heart" | "crown";

export type LoyaltyLogoPlacement =
  | "top-right"
  | "top-left"
  | "center"
  | "bottom-right"
  | "custom";

export type LoyaltyCardDesign = {
  enabled: boolean;
  brandName: string;
  cardTitle: string;
  subtitle: string;
  rewardTitle: string;
  supportingText: string;
  stampLabel: string;
  terms: string;
  stampsRequired: number;
  completedStamps: number;
  cardBackground: string;
  cardForeground: string;
  cardAccent: string;
  logoPreviewUrl?: string;
  logoPlacement: LoyaltyLogoPlacement;
  logoSize: number;
  logoOffsetX: number;
  logoOffsetY: number;
  progressIcon: LoyaltyProgressIcon;
  customIconPreviewUrl?: string;
  barcodeVisible: boolean;
  sampleCode: string;
};

export type LoyaltyPointsSettings = {
  enabled: boolean;
  pointValueSar: number;
  minimumRedemptionPoints: number;
  earningRule: string;
  redemptionRule: string;
  expiryDays: number;
  policyText: string;
  customerPointsBalance: number;
  usedPoints: number;
  earnedLastOperation: number;
  sampleInvoiceAmount: number;
};

export type LoyaltyDashboardDemoState = {
  card: LoyaltyCardDesign;
  points: LoyaltyPointsSettings;
};

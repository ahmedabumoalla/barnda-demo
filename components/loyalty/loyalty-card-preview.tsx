"use client";

import {
  LoyaltyBarcode,
  SharedLoyaltyCard,
  type LoyaltyDesignerLayer,
} from "@/components/loyalty/shared-loyalty-card";
import type { LoyaltyCardDesign } from "@/lib/loyalty/types";

type Props = {
  card: LoyaltyCardDesign;
  pointsBalance?: number;
  pointValueSar?: number;
  compact?: boolean;
  editable?: boolean;
  activeLayer?: LoyaltyDesignerLayer | null;
  onActiveLayerChange?: (layer: LoyaltyDesignerLayer) => void;
  onCardChange?: (card: LoyaltyCardDesign) => void;
};

export type { LoyaltyDesignerLayer };
export { LoyaltyBarcode };

export function LoyaltyCardPreview(props: Props) {
  return <SharedLoyaltyCard {...props} />;
}

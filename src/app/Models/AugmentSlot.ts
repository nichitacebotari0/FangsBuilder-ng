import { Augment } from "./Augment";
import { AugmentSlotCategory } from "./Enum/AugmentSlotCategory";

export interface AugmentSlot {
    augment?: Augment;
    augmentCategory: AugmentSlotCategory;
}

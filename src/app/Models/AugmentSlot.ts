import { AugmentSlotCategory } from "./Enum/AugmentSlotCategory";

export interface AugmentSlot {
    augmentData?: GenericAugmentData;
    augmentCategory: AugmentSlotCategory;
    currentlySlottedCategory: AugmentSlotCategory;
}

export interface GenericAugmentData {
    id: number;
    name: string;
    description: string;
    imagePath: string;
}

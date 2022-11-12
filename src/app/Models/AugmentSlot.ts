import { Augment } from "./Augment";
import { AugmentSlotCategory } from "./Enum/AugmentSlotCategory";

export class AugmentSlot {
    augment?: Augment;
    augmentCategory: AugmentSlotCategory;

    constructor(augmentCategory: AugmentSlotCategory,
        augment?: Augment) {
        this.augmentCategory = augmentCategory;
        this.augment = augment;
    }
}

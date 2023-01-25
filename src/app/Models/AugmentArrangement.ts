export interface AugmentArrangement {
    id: number;
    patchId: number;
    augmentSlots: AugmentArrangementSlot[];
}

export interface AugmentArrangementSlot {
    id: number;
    augmentCategoryId: number;
    augmentArrangementId: number;
    sortOrder: number;
}
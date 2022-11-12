export enum AugmentCategory {
    POSITIONAL = 0,
    COMBAT = 1,
    UTILITY = 2,
    ULTIMATE = 3,
    FLEX = 4,
    ACTIVE = 5
}

export class Augment {
    id: number;
    name: string;
    description: string;
    imgPath: string;
    augmentCategory: AugmentCategory;

    constructor(id: number,
        name: string,
        description: string,
        imgPath: string,
        augmentCategory: AugmentCategory) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imgPath = imgPath;
        this.augmentCategory = augmentCategory;
    }
}

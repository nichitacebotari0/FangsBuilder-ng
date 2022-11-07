export enum AugmentCategory {
    POSITIONAL = 0,
    RED = 1,
    YELLOW = 2,
    ULT = 3,
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

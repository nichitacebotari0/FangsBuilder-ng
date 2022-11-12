export class Augment {
    id: number;
    name: string;
    description: string;
    imgPath: string;
    augmentCategory: number;
    abilityType: number;

    constructor(id: number,
        name: string,
        description: string,
        imgPath: string,
        augmentCategory: number,
        abilityType: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imgPath = imgPath;
        this.augmentCategory = augmentCategory;
        this.abilityType = abilityType;
    }
}
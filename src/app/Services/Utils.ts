import { AugmentCategory } from "../Models/Augment";

export class Utils {

    GetColor(augmentCategory: AugmentCategory) {
        switch (augmentCategory) {
            case AugmentCategory.POSITIONAL:
                return "bg-sky-700";
            case AugmentCategory.COMBAT:
                return "bg-red-800";
            case AugmentCategory.UTILITY:
                return "bg-yellow-600";
            case AugmentCategory.ULTIMATE:
                return "bg-violet-800";
            case AugmentCategory.FLEX:
                return "bg-stone-500";
            case AugmentCategory.ACTIVE:
                return "bg-yellow-800";
        }
    }
}
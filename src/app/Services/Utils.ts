import { AugmentCategory } from "../Models/Augment";

export class Utils {

    GetColor(augmentCategory: AugmentCategory) {
        switch (augmentCategory) {
            case AugmentCategory.POSITIONAL:
                return "bg-sky-700";
            case AugmentCategory.RED:
                return "bg-red-800";
            case AugmentCategory.YELLOW:
                return "bg-yellow-600";
            case AugmentCategory.ULT:
                return "bg-violet-800";
            //         case AugmentCategory.:
            //             return "bg-stone-500";
            // case "ACTIVE":
            //     return "bg-yellow-800";
        }
    }
}
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AugmentSlot, GenericAugmentData } from 'src/app/Models/AugmentSlot';
import { AugmentSlotCategory } from 'src/app/Models/Enum/AugmentSlotCategory';
import { ActiveService } from '../active.service';
import { ArtifactService } from '../artifact.service';
import { AugmentService } from '../augment.service';

export interface CategorisedGenericAugmentData {
  augment: GenericAugmentData | undefined;
  category: AugmentSlotCategory;
}

@Injectable({
  providedIn: 'root'
})
export class BuildSerializerService {

  constructor(private augmentService: AugmentService,
    private artifactService: ArtifactService,
    private boonService: ActiveService) { }

  Serialize(augmentSlots: AugmentSlot[]): string {
    return augmentSlots
      .map(x => x.currentlySlottedCategory + ':' + (x.augmentData?.id ?? -1))
      .join(',');
  }

  Deserialize(heroId: number, patchId: number, build: string): Observable<CategorisedGenericAugmentData | undefined>[] {
    return build.split(',')
      .map(x => {
        const aug = x.split(':');
        return this.getAugment(heroId, patchId, aug[0], aug[1])
          .pipe(
            map(x => {
              return ({
                augment: x,
                category: Number(aug[0]) as AugmentSlotCategory
              } as CategorisedGenericAugmentData);
            })
          );
      });
  }

  private getAugment(heroId: number, patchId: number, category: string, idString: string): Observable<GenericAugmentData | undefined> {
    const id = Number(idString);
    if (!id || id < 0)
      return of(undefined);
    const categoryId = Number(category) as AugmentSlotCategory;
    if (!categoryId || [AugmentSlotCategory.FLEX, AugmentSlotCategory.NONE].includes(categoryId))
      return of(undefined);

    switch (categoryId) {
      case AugmentSlotCategory.ACTIVE:
        return this.boonService.get(patchId)
          .pipe(
            map(x => x.find(aug => aug.id == id)))
      case AugmentSlotCategory.COMBAT:
      case AugmentSlotCategory.UTILITY:
      case AugmentSlotCategory.ULTIMATE:
        return this.augmentService.get(heroId, patchId)
          .pipe(
            map(x => x.find(aug => aug.id == id && aug.augmentCategoryId == categoryId)))
      case AugmentSlotCategory.POSITIONAL:
        return this.artifactService.get(patchId)
          .pipe(
            map(x => x.find(aug => aug.id == id)))
      default:
        return of(undefined);
    }
  }
}
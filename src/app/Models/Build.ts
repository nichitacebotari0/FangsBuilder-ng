export interface Build {
    id: number;
    userId: string;
    heroId: number;
    patchId: number;
    title: string;
    augments: string;
    description: string | null | undefined;
    upvotes: number;
    downvotes: number;
    createdAt: Date;
    modifiedAt: Date;
}
export interface Patch {
    id: number;
    title: string;
    version: string;
    gameDate: Date,
    websiteTimeUtc: Date | undefined
}
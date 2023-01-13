export interface ChangeLog {
    id: number;
    model: string;
    discordId: string;
    discordNick: string;
    summaryPrevious: string;
    summaryNext: string;
    createdAtUtc: Date;
}
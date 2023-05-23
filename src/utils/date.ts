import dayjs from "dayjs";

export function formatDate(date: string | undefined): string {
    if (!date) return ""
    return dayjs(date, "YYYYMMDD").format("YYYY.MM.DD")
}
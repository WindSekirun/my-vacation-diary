import dayjs from "dayjs";

export function formatDate(date: string): string {
    return dayjs(date, "YYYYMMDD").format("YYYY.MM.DD")
}
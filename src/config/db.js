import { PrismaClient } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    const result = await next(params);

    if (result && typeof result === "object") {
        const fields = ["created_at", "updated_at"];

        fields.forEach((field) => {
            if (result[field]) {
                result[field] = formatInTimeZone(result[field], "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
            }
        });
    }

    return result;
});

export default prisma;
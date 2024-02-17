import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient({
log:["query"],   // to check and see query  

});

export default prisma;
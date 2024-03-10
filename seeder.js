import prisma from "./db/db.config.js";
import products from "./data/products.js";
import users from "./data/users.js";

const importData = async () => {
    try {
        // await prisma.order.deleteMany();
        // await prisma.product.deleteMany();
        // await prisma.user.deleteMany();
        
        // const createdUsers = await prisma.user.createMany({ data: users})
        // const adminUser = createdUsers[2].id

        const adminUse = await prisma.user.findUnique({
            where: { id: 2 }
        });
  
        const adminUser = adminUse.id;
        const sampleProducts = products.map(p => {
            return { ...p, userId: adminUser }
        })
  
        await prisma.product.createMany({ data: sampleProducts})
        console.log("Data Imported!")
        process.exit()
    } catch (error) {
        console.error(`Error: ${error}`)
        process.exit(1)
    }
  }
  
  const destroyData = async () => {
    try {
      await prisma.order.deleteMany()
      await prisma.product.deleteMany()
      await prisma.user.deleteMany()
  
      console.log("Data Destroyed!")
      process.exit()
    } catch (error) {
      console.error(`Error: ${error}`)
    }
  }
  
  if (process.argv[2] == "-d") {
    destroyData()
  } else {
    importData()
  }
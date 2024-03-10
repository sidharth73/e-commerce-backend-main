import prisma from "../db/db.config.js";
import asyncHandler from "express-async-handler";

const getProducts = asyncHandler(async (req,res) => {
    const products = await prisma.product.findMany();
    if (products) {
        res.json(products);   
    } else {
        res.status(404)
        new Error("Resource not found");
    }
});

const getProductById = asyncHandler(async (req,res) => {
    const id = req.params.id;
    const pro = await prisma.product.findUnique({
        where: { id: Number(id) }
    });

    if (pro) {
        res.json(pro);
    } else {
        res.status(404)
        throw new Error("Product not found");
    }
});

export { getProducts, getProductById };
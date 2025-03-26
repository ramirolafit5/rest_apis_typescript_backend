import { Request, Response } from 'express'
import Product from '../models/Product.model'
 
// siempre que interactuamos con el modelo las funciones son asincronas

export const getProducts = async (req: Request, res: Response) => {
    const product = await Product.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    res.json({data: product})
}

export const getProductsById = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({error: 'Producto no encontrado'})
    }

    res.json({data: product})
}

export const createProduct = async (req : Request, res: Response) => {

    //llevamos la validacion para el router (cambian los check por body)

    //llevamos tmb los errores hacia el middleware para manejarlos desde ahi

    const product = await Product.create(req.body)
    res.status(201).json({data: product})
}

export const updateProduct = async (req: Request, res: Response) => {

    //Verificamos que exista tal como hicimos en findProductById

    const { id } = req.params
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({error: 'Producto no encontrado'})
    }

    //Ahora actualizamos el producto
    await product.update(req.body)
    await product.save()

    res.json({data: product})
}

export const updateAvailability = async (req: Request, res: Response) => {
    
    //Verificamos que exista tal como hicimos en findProductById

    const { id } = req.params
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({error: 'Producto no encontrado'})
    }

    //Ahora actualizamos el producto
    //"!product.dataValues.availability" lo que hace es decir bueno toma ese atributo y asignale su contrario
    product.availability = !product.availability

    await product.save()

    res.json({data: product})
}

export const deleteProduct = async (req: Request, res: Response) => {
    
    //Verificamos que exista tal como hicimos en findProductById
    const { id } = req.params
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({error: 'Producto no encontrado'})
    }

    //Ahora borramos el producto
    await product.destroy()
    await product.save()

    res.json({data: 'Producto eliminado.'})
}
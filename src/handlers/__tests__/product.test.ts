import request from 'supertest'
import server from '../../server'
import exp from 'node:constants'

//creamos varias pruebas aca mismo (cada test es una de ellas)

describe('POST /api/products', () => {
    
    test('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})
    
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
    })

    test('should validate that the price es higher than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Parlante JBL - Testing",
            price: 0
        })
    
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
    })

    test('should validate that the price is a number and higher than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Parlante JBL - Testing",
            price: "hola"
        })
    
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
    })

    test('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Parlante JBL - Testing",
            price: 230
        })
        console.log(response.body)
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)   
        expect(response.body).not.toBe('errors')
    })
})

describe('GET /api/products', () => {

    test('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).not.toBe(404)
    })

    test('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')

        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    
    test('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`) 

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')
        
    })

    test('should check a valid ID in the URL', async () => {
        const response = await request(server).get(`/api/products/not-valid-url`)
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    test('GET a JSON response for a single product', async () => {
        const response = await request(server).get(`/api/products/1`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    test('should check a valid ID in the URL', async () => {
        const response = await request(server).put(`/api/products/not-valid-url`).send({
            name: "Monitor actualizado 55'",
            price: 500,
            availability: true
        })
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    test('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    test('should validate that the price is higher than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Monitor actualizado 32'",
            price: -500,
            availability: true
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('El precio debe ser mayor a 0')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    test('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`) .send({
            name: "Monitor actualizado 32'",
            price: 500,
            availability: true
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    test('should update an existing product with valid data', async () => {
        const response = await request(server).put('/api/products/1') .send({
            name: "Monitor actualizado 32'",
            price: 500,
            availability: true
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
    
})

describe('PATCH /api/products/:id', () => {

    test('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    test('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)
    })
})

describe('DELETE /api/products/:id', () => {
    test('should check a valid id', async () => {
        const response = await request(server).delete('/api/products/not-valid')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    test('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
    })

    test('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBe('Producto eliminado.')

        expect(response.status).not.toBe(404)
    })
        
})
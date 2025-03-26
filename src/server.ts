import express from "express"
import rounter from "./router"
import db from "./config/db"
import colors from 'colors'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from "./config/swagger"
import cors, {CorsOptions } from "cors"
import morgan from "morgan"



//Conectar a base de datos
export async function connectDB(){

    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.magenta('Conexion exitosa a la BD'))
    } catch (error) {
        console.log(error)
        console.log('Hubo un error al conectar a la BD')
    }
}

connectDB()

// Instancia de express
const server = express()

//Permitir conexiones
const corsOptions: CorsOptions = {
    origin: function(origin, callback){
        if (origin === process.env.FRONTEND_URL){
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', rounter)

server.get('/api', (req, res) => {
    res.json({msg: 'Desde API'})
})

//Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUiOptions))

export default server
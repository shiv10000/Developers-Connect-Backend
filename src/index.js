import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import connectDB from "./db/index.js";
import {app} from "./app.js"

connectDB()
.then(
    () => {
        app.on("error",(error) => {
            console.log("error : ",error)
            throw error
        })
        app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening on port ${process.env.PORT}`)
})
    }
)
.catch(
    (error) => {
        console.log("Mongodb connection is failed",error)
    }
)



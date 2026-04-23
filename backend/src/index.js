import { connectDB } from "./db/index.js";
import { app } from "./app.js";

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("Error : ", error);
        throw error;
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server Running at PORT: ${process.env.PORT || 8000}`);
    })
})
.catch((err) => {
    console.log("MongoDB Connection Failed !!", err);
})
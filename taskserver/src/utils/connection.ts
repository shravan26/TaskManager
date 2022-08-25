import { AppDataSource } from "@src/data-source"

export const connectToDB = () => {
    AppDataSource.initialize()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => console.error(err))
}
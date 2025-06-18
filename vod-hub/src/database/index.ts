import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const connect = async () => (await client.connect()).db('lapid-vod');

export const db = connect().then(db => {
    console.log('Connected to database successfully');
    return db;
});

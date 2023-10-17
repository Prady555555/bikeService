// import mongodb from "mongodb "  

import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb"

let database ;
// This is the code for the mongoDB connection
async function getDatabase() {
  const client = await MongoClient.connect('mongodb+srv://bikeservice926:Bike2002@cluster0.d5lhbwz.mongodb.net/?retryWrites=true&w=majority')
  database = client.db("bike");
  if(!database){
    console.log(`database is not created`)
  }
  return database;
}

export {getDatabase , ObjectId as IdConverter};
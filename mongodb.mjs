import { MongoClient } from 'mongodb';
const uri = "mongodb+srv://dbcrud:dbcrud@cluster0.pwbais0.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

export const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  }catch(e){
    console.log(e.stack);
    await client.close();
    process.exit(1);
  }
}
run().catch(console.dir);

process.on('SIGINT', async ()=>{
    console.log("App is terminating");
    await client.close();
    process.exit(0);
})
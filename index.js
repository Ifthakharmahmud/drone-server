const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wu3dk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){

	try{

		await client.connect();
		 const database = client.db("drone");
		 const droneCollection = database.collection("drones");
		 const reviewCollection = database.collection("reviews");
		 const droneordersCollection = database.collection("drone_orders");
		 const usercollection = database.collection("user");


		 // USER API'S

		 // GET Admin API
	         app.get('/user/:email', async (req, res) => {
	             const email = req.params.email;
	             const getEmail = { email: email };
	             const user = await usercollection.findOne(getEmail);
	             let isAdmin = false;
	             if (user?.role === 'admin') {
	                 isAdmin = true;
	             }
	             res.json({ admin: isAdmin });
	         })

	         // POST User API
	         app.post('/user', async(req,res)=>{
	             const user = req.body;
	             const result = await usercollection.insertOne(user);
	             console.log(result)
	             res.json('result');
	         })

	         //PUT User API
	         app.put('/user', async (req, res) => {
	             const user = req.body;
	             const filter = { email: user.email };
	             const options = { upsert: true };
	             const updateDoc = { $set: user };
	             const result = await usercollection.updateOne(filter, updateDoc, options);
	             res.json(result);
	         });

	         // PUT Admin API
                app.put('/user/admin', async (req, res)=>{
                    const user = req.body;
                    const filter = {email: user.email};
                    const options = { upsert: true };
                    const updateDoc = {
                        $set : {role: user.role}
                    }
                    const result = await usercollection.updateOne(filter, updateDoc, options);
                    res.json(result)
                })



		 //GET API - Drones for home page

		 app.get('/drones/home', async(req, res)=>{


		 	// const cursor = droneCollection.find({})
		 	const cursor = droneCollection.find().sort({_id:1}).limit(6);

		 	const drones = await cursor.toArray();
		 	res.send(drones);

		 })

		 //GET API - Drones

		 app.get('/drones', async(req, res)=>{


		 	const cursor = droneCollection.find({})
		 	// const cursor = droneCollection.find().find().sort({_id:1}).limit(5);

		 	const drones = await cursor.toArray();
		 	res.send(drones);

		 })

		 //DELETE API - Drones (All Products)

		 app.delete('/drones/:id', async(req , res)=>{
			const id = req.params.id;
			const query = {_id:ObjectId(id) };
			const result = await droneCollection.deleteOne(query);
			console.log('Deleting this ID: ', id);


			res.json(result);

		});

		 //POST API - Drones

		 app.post('/drones', async(req, res) => {
		 	
		 	const drone = req.body;
		 	// console.log(drones)

		 	const result = await droneCollection.insertOne(drone)

		 	console.log(result)

		 	res.json(result)

		 } )

		 // USER REVIEW POST AND GET API

		 //POST API - USER REVIEW

		 app.post('/user_review', async(req, res) => {
		 	
		 	const userReview = req.body;
		 	// console.log(drones)

		 	const result = await reviewCollection.insertOne(userReview)

		 	console.log(result)

		 	res.json(result)

		 } )


		 //GET API - USER REVIEW
		 app.get('/user_review', async(req, res)=>{


		 	const cursor = reviewCollection.find({})
		 	// const cursor = droneCollection.find().find().sort({_id:1}).limit(5);

		 	const reviews = await cursor.toArray();
		 	res.send(reviews);

		 })

		 

		 // ORDERS POST AND GET API

		 //POST API - ORDERS

		 app.post('/drone_orders', async(req, res) => {
		 	
		 	const orders = req.body;
		 	// console.log(drones)

		 	const result = await droneordersCollection.insertOne(orders)

		 	console.log(result)

		 	res.json(result)

		 } )

		 //GET API - ORDERS
		 app.get('/drone_orders', async(req, res)=>{


		 	const cursor = droneordersCollection.find({})
		 	// const cursor = droneCollection.find().find().sort({_id:1}).limit(5);

		 	const orders = await cursor.toArray();
		 	res.send(orders);

		 })


		 //DELETE API - ORDERS DELETE

		 app.delete('/drone_orders/:id', async(req , res)=>{
			const id = req.params.id;
			const query = {_id:ObjectId(id) };
			const result = await droneordersCollection.deleteOne(query);
			console.log('Deleting this ID: ', id);


			res.json(result);

		});


	}
	finally{
		//await client.close();
	}

}

run().catch(console.dir)

app.get('/', (req , res)=>{
	res.send('Server is running');
});



app.listen(port,()=>{
	console.log('Running Drone Server On: ', port);
} );
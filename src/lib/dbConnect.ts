import mongoose from "mongoose"

type ConnectionObject = {
  isConnected?: number;
}

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already Connected to DB")
    return
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!)

    connection.isConnected = db.connections[0].readyState
    console.log("DB Connected Successfully")
  } catch (err) {

    console.log("DB Connection Failed", err)
    process.exit(1)
  }
}
export default dbConnect;






// // src/lib/db.ts
// import mongoose from 'mongoose';

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your MONGODB_URI to .env.local');
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectDB;
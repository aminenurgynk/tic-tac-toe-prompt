import * as dotenv from "dotenv";
import { OpenAI } from "openai";
// import http from "http";

// const port = 3030;

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// //Create new assistant
// const assistant =   await openai.beta.assistants.create({
//     name : "TicTacTech2",
//     instructions: "Let's play tic tac toe with you on a 3x3 board, we will play the game in array format (['','','','','','','','','']), write your move in the array I send you and send it back if you are ready, let's start give your answers only as an array  (I know you are a text-based AI, let's play this game text-based)",
//     tools: [
//         {
//         type: "code_interpreter",
//     },
// ],
// model: "gpt-4-1106-preview",
// });
// console.log(assistant.id) //asst_7CjZQSSw3KgmpoPgU2daRcf4

const assistant = await openai.beta.assistants.retrieve(
    "asst_7CjZQSSw3KgmpoPgU2daRcf4"             // "asst_5aMfjGbdMXC6xPRgGsVce0RJ"
);

// //Threads
const thread = await openai.beta.threads.create();
// console.log(thread); // thread_u4JLZBBmQvVdk92P4ZrOOWQI

// //Create Message
const message = await openai.beta.threads.messages.create(thread.id, {
  role: "user",
  content: "['','X','','','','','','','']",
});
//console.log(message);

//Run assistant
const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistant.id,
  instructions: "Address the user as Vudi",
});

// const run = await openai.beta.threads.runs.retrieve(
//     "thread_u4JLZBBmQvVdk92P4ZrOOWQI",
//     "run_roKKJ1o7o3p25hJZEmdzDSoY",
// );

// console.log(run);

const messages = await openai.beta.threads.messages.list(
  "thread_u4JLZBBmQvVdk92P4ZrOOWQI"
);
messages.body.data.forEach((message) => {
  console.log(message.content);
});

const logs = await openai.beta.threads.runs.steps.list();


// ----------------------------------------------------------------
// const server = http.createServer(function (req, res) {
//   // Write a response to the client
//   res.write("Hello World");

//   // End the response
//   res.end();
// });

// // Set up our server so it will listen on the port
// server.listen(port, function (error) {
//   // Checking any error occur while listening on port
//   if (error) {
//     console.log("Something went wrong", error);
//   }
//   // Else sent message of listening
//   else {
//     console.log("Server is listening on port" + port);
//   }
// });


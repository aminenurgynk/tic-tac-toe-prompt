import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
const port = 3031;

app.use(cors());

let openai = null;
let threadId = null;
let runID = null;

const createOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: "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",
    });
  }
};

const createThread = async () => {
  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
    //console.log(threadId);
  }
};

const waitForCompletion = async (thread_id, run_id) => {
  let run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
  while (run.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //console.log('Waiting for completion...');
    run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
    //console.log(run);
  }
  return run;
};

app.use(express.json());

app.post("/", async (req, res) => {
  const getData = async (req, res) => {
    //console.log(req.body.board);
    createOpenAI();
    await createThread();
    console.log(`Requests..........`);
    console.log(req.body.board);

    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `${req.body.board}`,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: "asst_5aMfjGbdMXC6xPRgGsVce0RJ",
      instructions:
        "You are a Tic Tac Toe assistant. You are the most professional Tic Tac Toe player in the world. You have a perfect strategy. Let's play Tic Tac Toe on a 3x3 board. We will play the game in array format ['', '', '', '', '', '', '', '', '']. Write your move in the array I send you, and when you are ready, send it back. Let's start. Provide your answers only as an array (I know you are a text-based artificial intelligence, so let's play this game text-based) and never send me any data expect your answer!",
    });

    //console.log(run);
    runID = run.id;
    await waitForCompletion(threadId, runID);

    const messages = await openai.beta.threads.messages.list(threadId);
    messages.body.data.forEach((message) => {
      console.log("--------------------------------------------");
      console.log(message.content[0].text.value);
      console.log("--------------------------------------------");
    });
    const lastMessage =
      messages.body.data[0].content[0].text.value || "No messages";

    res.status(200).json({ lastMessage });
  };

  getData(req, res);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

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
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
};

const createThread = async () => {
  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
  }
};

const waitForCompletion = async (thread_id, run_id) => {
  let run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
  while (run.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
 
  }
  return run;
};

app.use(express.json());

app.post("/", async (req, res) => {
  const getData = async (req, res) => {
    createOpenAI();
    await createThread();
    console.log(`Requests..........`);
    console.log(req.body.board);

    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `${req.body.board}`,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID,
     // instructions: Here write your asistant's instructions
    });

    runID = run.id;
    await waitForCompletion(threadId, runID);

    const messages = await openai.beta.threads.messages.list(threadId);
    messages.body.data.forEach((message) => {
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

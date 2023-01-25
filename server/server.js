import express from "express";
import * as dotenv from "dotenv";
import cors from "cors"; //Cors in Nodejs :CORS (Cross-Origin Resource Sharing) is a mechanism that allows a web page to make requests to a different domain than the one that served the web page. This is known as a "cross-origin" request. error only happens when the origin is different. Reference YT link => https://youtu.be/OX-9oOcPDfE
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

//The Configuration class is used to configure the connection to the OpenAI API, including setting the API key, which is a required parameter to access the API.
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

//So this block of code is essentially initializing the connection to the OpenAI API using the API key that was loaded from the .env file and creating an instance of the OpenAIApi class that can be used to interact with the OpenAI API.The OpenAIApi class provides methods to interact with the OpenAI API.
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "hello from Codex",
  });
});

// diff. between get & post method . With the app.get() rout we can receive a lot of data from the front end but the post one allows us to have the body or Payload.
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt; //receiving user prompt from front end

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.7, // higher temperature value means the model will take more risk to give answer inthis case we dont really want a lot of risk we wanted it to answer what it knows, so we are replacing the value 0.7 to 0
      max_tokens: 3000, //how long responce it can take
      top_p: 1,
      frequency_penalty: 0.5, //it want response simmilar sentance again means will give different answer for same question if asked again and again
      presence_penalty: 0,
    });

    //once we get he response send it back to frontend
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);

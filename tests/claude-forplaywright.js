import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
//require("dotenv").config("path: /config/.env");

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

let messages = [
  {"role": "user", "content": "if rules not under .claude/rules folder, how are they loaded into context when respective path matches in claude code?"}
] 

let response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1000,
  system: "you are a helpful assistant that explains claude behaviour and concepts",
  messages: messages,
}
)


console.log(response.content[0].text);
console.log(response.usage.input_tokens, response.usage.output_tokens);
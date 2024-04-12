import express from "express";
import {
  Consumer,
  EachMessagePayload,
  Kafka,
  logLevel,
  Partitioners,
} from "kafkajs";
import { appendFile } from "fs";

/**
 * Initialize Express
 **/
const app = express();
const port = process.env.EXPRESS_PORT || 3004;
const filePath = __dirname + "/public/file.txt";

app.use(express.static(__dirname + "/public"));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`File url: http://localhost:${port}/file.txt`);
});

/**
 * Initialize Kafka
 **/
const kafka = new Kafka({
  clientId: "file",
  brokers: ["localhost:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

/**
 * Create topics for message request and response
 **/
const admin = kafka.admin();

async function createTopics() {
  console.log("Creating topics");

  await admin.connect();

  const topics = await admin.listTopics();

  if (topics.includes("file-request") && topics.includes("file-response")) {
    console.log("Topics already created");
    return;
  }

  await admin.createTopics({
    topics: [
      {
        topic: "file-request",
        numPartitions: 1,
      },
      {
        topic: "file-response",
        numPartitions: 1,
      },
    ],
  });

  await admin.disconnect();
}

createTopics()
  .then(() => {
    console.log("Topics created");

    const request = new Request();
    request.handleRequest();
  })
  .catch(console.error);

/**
 * Request class to handle message request
 **/
class Request {
  consumer: Consumer;

  constructor() {
    this.consumer = kafka.consumer({
      groupId: "change-file-group",
      heartbeatInterval: 3000,
    });
  }

  async handleRequest() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "file-request" });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
        heartbeat,
      }: EachMessagePayload) => {
        const messageContent = message.value ? message.value.toString() : "";

        console.log("\nReceived message:", {
          topic: topic,
          partition: partition,
          value: messageContent,
        });

        try {
          appendFile(filePath, messageContent + "\n", (err) => {
            if (err) {
              throw err;
            }
          });

          const response = JSON.stringify({
            type: "success",
            channel: "file",
            message: "File changed successfully!",
          });

          await this.sendResponse(message, response);
        } catch (error) {
          await this.sendResponse(message, "Error changing file");
        }

        await heartbeat();

        console.log("Message processed");
      },
    });
  }

  async sendResponse(message: any, response: string) {
    console.log("Sending response:", response);

    const producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });

    await producer.connect();

    const key = message.key ? message.key.toString() : "";

    await producer.send({
      topic: "file-response",
      messages: [
        {
          key: key,
          value: response,
        },
      ],
    });

    await producer.disconnect();
  }
}

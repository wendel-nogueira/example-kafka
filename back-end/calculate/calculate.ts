import {
  Consumer,
  EachMessagePayload,
  Kafka,
  logLevel,
  Partitioners,
} from "kafkajs";

/**
 * Initialize Kafka
 **/
const kafka = new Kafka({
  clientId: "calculate",
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

  if (
    topics.includes("calculate-request") &&
    topics.includes("calculate-response")
  ) {
    console.log("Topics already created");
    return;
  }

  await admin.createTopics({
    topics: [
      {
        topic: "calculate-request",
        numPartitions: 1,
      },
      {
        topic: "calculate-response",
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
      groupId: "calculate-group",
      heartbeatInterval: 3000,
    });
  }

  async handleRequest() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "calculate-request" });

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

        let result = "Invalid expression";

        try {
          result = parseFloat(eval(messageContent)).toString();

          if (result === "NaN") {
            result = "Invalid expression";
          }
        } catch (error) {}

        const response = JSON.stringify({
          type: "success",
          channel: "calculate",
          message: result,
        });

        await this.sendResponse(message, response);
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
      topic: "calculate-response",
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

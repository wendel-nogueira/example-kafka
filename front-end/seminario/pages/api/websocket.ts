import { RawData, WebSocketServer } from "ws";
import IRequest from "@/intefaces/IRequest";
import { Kafka, Partitioners, logLevel } from "kafkajs";
import IResponse from "@/intefaces/IResponse";

const channels = [
  {
    name: "calculate",
    request: "calculate-request",
    response: "calculate-response",
  },
  {
    name: "file",
    request: "file-request",
    response: "file-response",
  },
  {
    name: "message",
    request: "message-request",
    response: "message-response",
  },
];
const kafka = new Kafka({
  clientId: "a",
  brokers: ["localhost:9092"],
  logLevel: logLevel.WARN,
});
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const consumer = kafka.consumer({
  groupId: "websocket-group",
  heartbeatInterval: 3000,
});

export default async function handler(req: any, res: any) {
  try {
    const response = await fetch("http://localhost:3002")
      .then((res) => {
        return "WebSocket already started!";
      })
      .catch((err) => {
        const ws = new WebSocketServer({ port: 3002 });

        producer
          .connect()
          .then(() => {
            console.log("Producer connected!");
          })
          .catch((error) => {
            console.error("Error connecting producer:", error);
          });

        consumer
          .connect()
          .then(() => {
            console.log("Consumer connected!");

            channels.forEach((channel) => {
              consumer.subscribe({ topic: channel.response });
            });

            consumer.run({
              eachMessage: async ({ topic, partition, message }) => {
                const data = message.value;

                if (!data) {
                  console.error("Empty message received!");
                  return;
                }

                try {
                  const messageData = JSON.parse(data.toString()) as IResponse;
                  const channel = channels.find((c) => c.response === topic);

                  console.log("Message received:", messageData);

                  if (!channel) {
                    console.error("Channel not found!");
                    return;
                  }

                  ws.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                      client.send(
                        JSON.stringify({
                          type: "success",
                          channel: channel.name,
                          message: messageData.message,
                        })
                      );
                    }
                  });
                } catch (error) {
                  console.error("Error sending message to ws:", error);
                }
              },
            });
          })
          .catch((error) => {
            console.error("Error connecting consumer:", error);
          });

        ws.on("connection", (ws) => {
          ws.on("message", (message: RawData) => {
            try {
              const messageData = JSON.parse(message.toString()) as IRequest;
              const channel = channels.find(
                (c) => c.name === messageData.channel
              );

              if (channel) {
                producer.send({
                  topic: channel.request,
                  messages: [
                    {
                      value: messageData.message,
                    },
                  ],
                });
              } else {
                ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Channel not found!",
                  })
                );
              }
            } catch (error) {
              console.error(error);
            }
          });

          ws.send(
            JSON.stringify({
              type: "success",
              channel: "all",
              message: "Service started!",
            })
          );
        });

        return "WebSocket server started!";
      });

    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({ message: "Error starting WebSocket server!" });
  }
}

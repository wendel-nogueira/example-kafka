export default interface IMessage {
  text: string;
  type: "request" | "response";
  date: Date;
}

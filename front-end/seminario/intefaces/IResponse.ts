export default interface IResponse {
    type: 'success' | 'error',
    channel: string,
    message: string,
}
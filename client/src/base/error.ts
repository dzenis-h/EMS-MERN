export default class NetworkError extends Error {
  constructor({ message = "Something went wrong" }: { message?: string }) {
    super(message);

    Object.setPrototypeOf(this, NetworkError.prototype);
    this.name = "Network Error";
  }
}

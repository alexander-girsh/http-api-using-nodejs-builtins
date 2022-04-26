import { HttpTransport } from '../httpTransport';

export class WithHttpTransport {
  protected httpTransport: HttpTransport;
  constructor(httpTransportConfig: { baseURL?: string; timeout?: number }) {
    this.httpTransport = new HttpTransport(httpTransportConfig);
  }
}

import http from 'http';
import https from 'https';

export class HttpTransportError extends Error {
  readonly statusCode: number | null;
  readonly response: http.IncomingMessage | null = null;
  constructor(
    message: string,
    statusCode: number | null,
    response: http.IncomingMessage | null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class HttpTransport {
  protected baseURL: string;
  protected timeout: number;

  constructor(httpTransportConfig: { baseURL?: string; timeout?: number }) {
    const { baseURL, timeout } = httpTransportConfig;
    this.baseURL = baseURL || '';
    this.timeout = timeout || 30000;
  }

  private async doRequest(
    method: 'GET' | 'POST',
    url: string,
    payload?: Record<string, any>
  ) {
    return new Promise((resolve, reject) => {
      try {
        const serializedPayload = payload ? JSON.stringify(payload) : '';

        const selectedLibrary = this.baseURL.startsWith('https://')
          ? https
          : http;

        const request = selectedLibrary.request(
          new URL(url, this.baseURL),
          {
            method,
            timeout: this.timeout,
            headers: {
              'Content-Type':
                method === 'POST' ? 'application/json' : 'text/plain',
              'Content-Length': Buffer.byteLength(serializedPayload)
            }
          },
          (res: http.IncomingMessage) => {
            if (res.statusCode !== 200) {
              res.resume();
              reject(
                new HttpTransportError(
                  `Request failed with .statusCode=${res.statusCode}`,
                  res.statusCode || null,
                  res
                )
              );
            }

            let rawData = '';

            res.on('data', (chunk) => {
              rawData += chunk;
            });

            res.on('end', () => {
              const contentType = res.headers['content-type'];

              resolve({
                statusCode: 200,
                data:
                  contentType === 'application/json'
                    ? JSON.parse(rawData)
                    : rawData
              });
            });
          }
        );

        request.on('error', (err) => {
          reject(new HttpTransportError(err.message, null, null));
        });

        request.write(serializedPayload);

        request.end();
      } catch (e: Error | any) {
        console.error(e);
        reject(e);
      }
    });
  }

  get(url: string) {
    return this.doRequest('GET', url);
  }

  post(url: string, payload: Record<string, any>) {
    return this.doRequest('POST', url, payload);
  }
}

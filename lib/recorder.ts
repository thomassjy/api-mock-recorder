const RECORDER_URL = 'http://localhost:3005';

if (typeof window !== 'undefined') {
  ((xhr: XMLHttpRequest) => {
    const recordAPI = (
      xhrInstance: XMLHttpRequest,
      method: string,
      requestBody?: Document | XMLHttpRequestBodyInit | null
    ) => {
      if (xhrInstance.status === 200 && xhrInstance.responseURL.indexOf(RECORDER_URL) !== 0) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
          url: xhrInstance.responseURL,
          spec: requestBody,
          result: xhrInstance.response,
          method: method,
        });

        const requestOptions = {
          method: 'POST',
          headers: headers,
          body: raw,
        };

        fetch(RECORDER_URL + '/recordAPI', requestOptions);
      }
    };

    // PATCH XHR
    const originalOpen = xhr.open;
    xhr.open = function (method: string) {
      const originalSend = this.send;
      this.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
        const originalOnloadend = this.onloadend;
        if (originalOnloadend) {
          this.onloadend = function () {
            recordAPI(this, method, body);
            return originalOnloadend.apply(this, arguments as any);
          };
        }
        return originalSend.apply(this, arguments as any);
      };
      return originalOpen.apply(this, arguments as any);
    };
  })(XMLHttpRequest.prototype);
}

if (typeof window !== "undefined") {
  const RECORDER_URL = "http://localhost:3005";

  const sendMockData = (
    url: string,
    requestBody: Document | XMLHttpRequestBodyInit | BodyInit | null,
    response: any,
    method: string
  ) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      url,
      spec: requestBody,
      result: response,
      method: method,
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
    };

    fetch(RECORDER_URL + "/record-api", requestOptions);
  };

  // Patch XHR
  ((xhr: XMLHttpRequest) => {
    const recordAPI = (
      xhrInstance: XMLHttpRequest,
      method: string,
      requestBody: Document | XMLHttpRequestBodyInit | null
    ) => {
      if (
        200 === xhrInstance.status &&
        0 !== xhrInstance.responseURL.indexOf(RECORDER_URL)
      ) {
        sendMockData(
          xhrInstance.responseURL,
          requestBody,
          xhrInstance.response,
          method
        );
      }
    };

    const originalOpen = xhr.open;
    xhr.open = function (method: string) {
      const originalSend = this.send;
      this.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
        const originalOnloadend = this.onloadend;
        if (originalOnloadend) {
          this.onloadend = function () {
            recordAPI(this, method, body || null);
            return originalOnloadend.apply(this, arguments as any);
          };
        }
        return originalSend.apply(this, arguments as any);
      };
      return originalOpen.apply(this, arguments as any);
    };
  })(XMLHttpRequest.prototype);

  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    let [resource, config] = args;
    const response = await originalFetch.apply(this, args);

    if (0 !== resource.toString().indexOf(RECORDER_URL) && !!response) {
      // Need to clone the response for immutability
      const newResponse = await response.clone().text();
      if (200 === response.status) {
        sendMockData(
          resource.toString(),
          config?.body || null,
          newResponse,
          config?.method || ""
        );
      }
    }

    return response;
  };
}

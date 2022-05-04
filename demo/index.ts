import fetch from "node-fetch";
import server from "../generated/mockService.server";

server.listen();

(() => {
  fetch(
    "https://api-payod.pay.staging-traveloka.com/api/v2/payment/config/optionGroup",
    {
      method: "post",
    }
  )
    .then((res: { json: () => Promise<typeof JSON> }) => res.json())
    .then((data: typeof JSON) => {
      console.log(data);
    });
})();

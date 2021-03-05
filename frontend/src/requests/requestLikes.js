import axios from "axios";
import { domain, port } from "./URL";

export function getLikeslist(params = {}) {
  console.log("request likes", params);
  const URL = `${params.authorID}/inbox-like`;

  return axios
    .get(URL, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

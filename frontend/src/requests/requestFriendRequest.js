import axios from "axios";
import { domain, port } from "./URL";

export function postRequest(params = {}) {
  const URL = `${params.object.toString()}/inbox/`;

  return axios
    .post(URL, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export function deleteRequest(params = {}) {
  const URL = params.object.toString() + "/request/" + params.actor.toString();

  return axios
    .delete(URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export function getRequest(params = {}) {
  const URL = `${params.authorID.toString()}/inbox-request/`;
  return axios
    .get(URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

// Remote API
export function postRemoteRequest(params = {}) {
  if (params.auth === undefined) {
    // if auth not given, consider as current server
    params.auth = `JWT ${localStorage.getItem("token")}`;
  }
  var n = params.actor.indexOf("/author/");
  var m = params.object.indexOf("/author/");

  let params1 = {
    type: "follow",
    summary: params.summary,
    actor: {
      type: "author",
      id: params.actor,
      url: params.actor,
      host: params.actor.substring(0, n),
      displayName: "whatever",
      github: "http://github.com/whatever",
    },
    object: {
      type: "author",
      id: params.object,
      url: "https://c404posties.herokuapp.com/firstapp/2",
      host: params.object.substring(0, m),
      displayName: "j",
      github: "",
    },
  }
  console.log("params1", params1);
  return axios
    .post(params.URL, params1, {
      headers: {
        "Content-Type": "application/json",
        Authorization: params.auth,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export function deleteRemoteRequest(params = {}) {
  if (params.auth === undefined) {
    // if auth not given, consider as current server
    params.auth = `JWT ${localStorage.getItem("token")}`;
  }
  return axios
    .delete(params.URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: params.auth,
      },
      data: {
        remote: params.remote,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

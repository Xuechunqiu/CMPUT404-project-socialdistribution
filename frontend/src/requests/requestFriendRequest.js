import axios from "axios";

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
  return axios
    .post(params.URL, params, {
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

export function declineRemoteRequest(params = {}) {
  if (params.auth === undefined) {
    // if auth not given, consider as current server
    params.auth = `JWT ${localStorage.getItem("token")}`;
  }
  return axios
    .patch(params.URL, {
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

import axios from "axios";

export function createFriend(params = {}) {
  const URL =
    params.object.toString() + "/friends/" + params.actor.toString() + "/";

  return axios
    .put(URL, params, {
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

export function getFriendList(params = {}) {
  const URL = `${params.object}/friends/`;

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

export function getFriend(params = {}) {
  if (params.auth === undefined) {
    // if auth not given, consider as current server
    params.auth = `JWT ${localStorage.getItem("token")}`;
  }
  const URL =
    params.object.toString() + "/friends/" + params.actor.toString();
  return axios
    .get(URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: params.auth,
      },
      params: {
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

export function deleteFriend(params = {}) {
  const URL =
    params.object.toString() + "/friends/" + params.actor.toString();

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

// Remote API
export function createRemoteFriend(params = {}) {
  if (params.auth === undefined) {
    // if auth not given, consider as current server
    params.auth = `JWT ${localStorage.getItem("token")}`;
  }
  return axios
    .put(params.URL, params, {
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

export function getRemoteFriendList(params = {}) {
  return axios
    .get(params.URL, {
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

export function deleteRemoteFriend(params = {}) {
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
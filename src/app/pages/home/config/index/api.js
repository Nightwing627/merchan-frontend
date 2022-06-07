const API_URL = process.env.REACT_APP_API_URL;

export const addNewSegmentApi = (postBody) =>
  fetch(`${API_URL}/api/segments/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

export const addNewAdvertiserApi = (postBody) =>
  fetch(`${API_URL}/api/advertisers/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

export const addNewResponsibleApi = (postBody) =>
  fetch(`${API_URL}/api/responsibles/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

export const deleteSegmentByIdApi = (id) =>
  fetch(`${API_URL}/api/segments/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => err);

export const deleteAdvertiserByIdApi = (id) =>
  fetch(`${API_URL}/api/advertisers/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => err);

export const deleteResponsibleByIdApi = (id) =>
  fetch(`${API_URL}/api/advertisers/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => err);
export const updateSegmentApi = (id, postBody) =>
  fetch(`${API_URL}/api/segments/${id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(postBody),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
    });

export const updateResponsibleApi = (id, postBody) =>
  fetch(`${API_URL}/api/responsibles/${id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(postBody),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
    });

export const updateAdvertiserApi = (id, postBody) =>
  fetch(`${API_URL}/api/advertisers/${id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(postBody),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
    });

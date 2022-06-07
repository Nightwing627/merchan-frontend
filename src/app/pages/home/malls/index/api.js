const API_URL = process.env.REACT_APP_API_URL;

export const _checkStatus = (response) => {
  // raises an error in case response status is not a success
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

export const fetchAllMallsApi = () =>
  fetch(`${API_URL}/api/malls`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(({ malls }) => {
      return malls;
    });
export const fetchAllPartnersApi = () =>
  fetch(`${API_URL}/api/partners`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(({ partners }) => {
      return partners;
    });
export const addNewShoppingApi = (postBody) =>
  fetch(`${API_URL}/api/malls/  `, {
    method: "POST",
    headers: {
      Accept: "application/json",
      dataType: "json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  })
    .then(_checkStatus)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
export const addShoppingAvartarApi = (profileImage) =>
  fetch(`${API_URL}/api/fileupload`, {
    method: "POST",
    body: profileImage,
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => error);

export const deleteMallApi = (id) =>
  fetch(`${API_URL}/api/malls/${id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data));

export const updateMallApi = (id, postBody) =>
  fetch(`${API_URL}/api/malls/${id}`, {
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

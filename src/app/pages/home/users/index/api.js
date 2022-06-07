const API_URL = process.env.REACT_APP_API_URL;

export const fetchAllUsersApi = () =>
  fetch(`${API_URL}/api/users`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(({ users }) => {
      return users;
    });

export const fetchAddUserProfileImage = (profileImage) =>
  fetch(`${API_URL}/api/fileupload`, {
    method: "POST",
    body: profileImage,
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => error);

export const updateUserInfoApi = (id, postBody) =>
  fetch(`${API_URL}/api/users/${id}`, {
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
export const deleteUserApi = (id) =>
  fetch(`${API_URL}/api/users/${id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
export const addNewUserApi = (postBody) =>
  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  })
    .then(_checkStatus)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
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

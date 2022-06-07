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

export const fetchAllProductsApi = () =>
  fetch(`${API_URL}/api/products`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(({ products }) => {
      return { products };
    });
export const addNewProductApi = (postBody) =>
  fetch(`${API_URL}/api/products/  `, {
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
export const addProductAvartarApi = (profileImage) =>
  fetch(`${API_URL}/api/fileupload`, {
    method: "POST",
    body: profileImage,
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => error);

export const deleteProductApi = (id) =>
  fetch(`${API_URL}/api/products/${id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data));

export const updateProductApi = (id, postBody) =>
  fetch(`${API_URL}/api/products/${id}`, {
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
    });

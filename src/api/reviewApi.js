import axiosClientUser from "./axiosClientUser";

export const getReviewsByProductId = (productId) => {
  return axiosClientUser.get(`/Reviews/product/${productId}`);
};

export const createReview = (payload) => {
  return axiosClientUser.post("/Reviews", payload);
};

export const deleteReview = (id) => {
  return axiosClientUser.delete(`/Reviews/${id}`);
};

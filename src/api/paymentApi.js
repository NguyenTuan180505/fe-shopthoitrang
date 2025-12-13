import axiosClientUser from "./axiosClientUser";

export const createPayment = async (payload) => {
  const res = await axiosClientUser.post("/Payments", payload);
  return res.data;
};

import axiosClientUser from "../api/axiosClientUser";

export const cartService = {
  // Lấy giỏ hàng
  getCart() {
    return axiosClientUser.get("/Cart");
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem(cartItemId, quantity) {
    return axiosClientUser.put(`/Cart/update/${cartItemId}`, {
      quantity: quantity,
    });
  },

  // Xóa sản phẩm khỏi giỏ hàng (optional - có thể dùng sau)
  removeCartItem(cartItemId) {
    return axiosClientUser.delete(`/Cart/remove/${cartItemId}`);
  },

  addToCart(productID, quantity = 1) {
    return axiosClientUser.post("/Cart/add", {
      productID,
      quantity,
    });
  },
};

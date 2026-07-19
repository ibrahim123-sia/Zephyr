import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = ({ productId, delta, quantity, volume, concentration }) => {
    const newQuantity = quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          volume,
          concentration,
        })
      );
    }
  };

  const handleRemoveFromCart = ({ productId, volume, concentration }) => {
    dispatch(
      removeFromCart({ productId, guestId, userId, volume, concentration })
    );
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div key={index} className="flex items-start justify-between py-4 border-b border-zephyr-sand">
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded-sm"
            />
            <div>
              <h3 className="text-zephyr-noir font-medium">{product.name}</h3>
              <p className="text-sm text-zephyr-umber/60">
                {product.concentration} | {product.volume}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleQuantityChange({
                      productId: product.productId,
                      delta: -1,
                      quantity: product.quantity,
                      volume: product.volume,
                      concentration: product.concentration,
                    })
                  }
                  className="border border-zephyr-sand rounded-sm px-2 py-1 text-lg font-medium text-zephyr-umber hover:border-zephyr-gold"
                >
                  -
                </button>
                <span className="mx-4 text-zephyr-noir">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange({
                      productId: product.productId,
                      delta: 1,
                      quantity: product.quantity,
                      volume: product.volume,
                      concentration: product.concentration,
                    })
                  }
                  className="border border-zephyr-sand rounded-sm px-2 py-1 text-lg font-medium text-zephyr-umber hover:border-zephyr-gold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-zephyr-gold font-medium">${product.price.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart({
                  productId: product.productId,
                  volume: product.volume,
                  concentration: product.concentration,
                })
              }
            >
              <RiDeleteBin3Line className="h-5 w-5 mt-2 text-red-500 hover:text-red-700" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;

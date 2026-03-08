


import axios from "axios";
import { rootUrl } from "@/shared/_services/api_service";
import { setBookingDetails } from "@/store/bookingSlice";

import { Capacitor } from "@capacitor/core";
import { Checkout } from "capacitor-razorpay";


export function openRazorpay(apiResponse: any, authVar: any, dispatch: any) {
  if (Capacitor.isNativePlatform()) {
    return openRazorpayNative(apiResponse, authVar, dispatch);
  } else {
    return openRazorpayWeb(apiResponse, authVar, dispatch);
  }

}

async function openRazorpayWeb(apiResponse, authVar, dispatch) {

  const { booking, razorpayKey, order } = apiResponse;

  const options: any = {
    key: razorpayKey,
    amount: order?.amount,
    currency: order?.currency,
    name: "InstaYaar",
    description: "Payment for your order",
    order_id: order?.id,
    prefill: {
      name: authVar?.user?.firstName,
      email: authVar?.user?.email,
      contact: authVar?.user?.phoneNumber,
    },
    notes: {
      transactionId: booking?.serviceId,
      orderId: order?.id,
    },

    modal: {
      ondismiss: () => {
        dispatch(setBookingDetails(null));
      },
    },

    handler: async function (response: any) {
      try {
        const token = localStorage.getItem("token");
        const payResponse = await axios.post(
          `${rootUrl}serviceBooking/verifyPayment`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: booking?._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (payResponse.status === 200) {
          window.location.href = "/my-bookings";
        } else {
          dispatch(setBookingDetails({}));
        }
      } catch (error) {
        dispatch(setBookingDetails({}));
      }
    },

    theme: { color: "#3399cc" },
  };

  const rzp1 = new (window as any).Razorpay(options);

  rzp1.on("payment.failed", (response: any) => {
    dispatch(setBookingDetails(null));
    console.error("Payment failed:", response);
  });

  rzp1.open();
}

async function openRazorpayNative(apiResponse: any, authVar: any, dispatch?: any) {
  const { booking, razorpayKey, order } = apiResponse;

  try {
    const result = await Checkout.open({
      key: razorpayKey,
      amount: order?.amount,
      currency: order?.currency,
      name: "InstaYaar",
      description: "Payment for your order",
      order_id: order?.id,
      prefill: {
        name: authVar?.user?.firstName,
        email: authVar?.user?.email,
        contact: authVar?.user?.phoneNumber,
      },

      notes: {
        transactionId: booking?.serviceId,
        orderId: order.orderId,
      },

      theme: {
        color: "#3399cc",
      },
    } as any);
    await verifyPayment(result.response, booking, dispatch);
  } catch (error) {
    console.error("Razorpay cancelled / failed:", error);
    window.location.href = "/my-bookings";
  }
}

async function verifyPayment(response: any, booking: any, dispatch: any) {
  try {
    const token = localStorage.getItem("token");
    const payResponse = await axios.post(
      `${rootUrl}serviceBooking/verifyPayment`,
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        bookingId: booking?._id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (payResponse.status === 200) {
      window.location.href = "/my-bookings";
    } else {
      dispatch(setBookingDetails({}));
    }
  } catch (error) {
    dispatch(setBookingDetails({}));
  }
}

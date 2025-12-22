// import axios from "axios";
// import { rootUrl } from "@/shared/_services/api_service";

// export function openRazorpay(apiResponse: any, authVar: any) {
//   const { booking, razorpayKey, order } = apiResponse;

//   const options = {
//     key: razorpayKey,
//     amount: order?.amount,
//     currency: order?.currency,
//     name: "KaamDham",
//     description: "Payment for your order",
//     order_id: order?.id,
//     prefill: {
//       name: authVar?.user?.firstName,
//       email: authVar?.user?.email,
//       contact: authVar?.user?.phoneNumber,
//     },
//     notes: {
//       transactionId: booking?.serviceId,
//       orderId: order?.id,
//     },

//     handler: async function (response: any) {
//       try {
//         const token = localStorage.getItem("token");
//         const payResponse = await axios.post(
//           rootUrl + "serviceBooking/verifyPayment",
//           {
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             bookingId: booking?._id,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (payResponse.status === 200) {
//           window.location.href = "/my-bookings";
//         }
//       } catch (error: any) {
//       }
//     },

//     theme: { color: "#3399cc" },
//   };

//   const rzp1 = new (window as any).Razorpay(options);
//   rzp1.open();
// }


import axios from "axios";
import { rootUrl } from "@/shared/_services/api_service";
import { setBookingDetails } from "@/store/bookingSlice"; // <-- adjust path if needed

export function openRazorpay(apiResponse: any, authVar: any, dispatch: any) {
  const { booking, razorpayKey, order } = apiResponse;

  const options: any = {
    key: razorpayKey,
    amount: order?.amount,
    currency: order?.currency,
    name: "KaamDham",
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

    // 🔹 User closes Razorpay modal
    modal: {
      ondismiss: () => {
        dispatch(setBookingDetails(null));
      },
    },

    // 🔹 On successful payment
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
          // fallback if payment verification fails
          dispatch(setBookingDetails({}));
        }
      } catch (error) {
        dispatch(setBookingDetails({}));
      }
    },

    theme: { color: "#3399cc" },
  };

  const rzp1 = new (window as any).Razorpay(options);

  // 🔹 Payment failed inside Razorpay modal
  rzp1.on("payment.failed", (response: any) => {
    dispatch(setBookingDetails(null));
    console.error("Payment failed:", response);
  });

  rzp1.open();
}

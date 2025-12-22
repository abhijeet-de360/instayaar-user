
import axios from "axios";
import { rootUrl } from "@/shared/_services/api_service";
import { getJobApplicationById } from "@/store/jobApplicationSlice";
import { setShortlistData } from "@/store/shorlistSlice"; // ✅ import this

export function openRazorpayJob(apiResponse: any, authVar: any, jobId: any, dispatch: any) {
  const { razorpayKey, order, freelancerId } = apiResponse;

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

    handler: async function (response: any) {
      // ✅ Payment Success
      try {
        const token = localStorage.getItem("token");
        const payResponse = await axios.post(
          rootUrl + "jobApplication/verifyPayment",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            jobId,
            freelancerId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (payResponse.status === 200) {
          dispatch(getJobApplicationById(jobId));
        }
      } catch (error) {
        console.error("Payment verify error:", error);
      } finally {
        // ✅ Always clear shortlist data after success
        dispatch(setShortlistData({}));
      }
    },

    modal: {
      ondismiss: function () {
        // ✅ User closed Razorpay (pressed back or closed modal)
        dispatch(setShortlistData({}));
      },
    },

    theme: { color: "#3399cc" },
  };

  const rzp1 = new (window as any).Razorpay(options);

  // ✅ Handle failed payment event
  rzp1.on("payment.failed", () => {
    dispatch(setShortlistData({}));
  });

  rzp1.open();
}

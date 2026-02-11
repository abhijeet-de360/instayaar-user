import AgreementSignature, { AgreementSignatureRef } from "@/components/AgreementSignature";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { userChangeAgreement } from "@/store/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ClientAgreement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const signatureRef = useRef<AgreementSignatureRef>(null);
  const [checked, setChecked] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const handleSubmit = () => {
    const signatureBase64 = signatureRef.current.getSignature();
    dispatch(userChangeAgreement(signatureBase64, navigate))
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm h-14 px-4 flex items-center gap-3">
        {/* <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button> */}
        <p className="text-lg font-semibold">InstaYaar Client Agreement</p>
      </div>

      {/* Content */}
      <div className="px-4 py-4 overflow-hidden h-[calc(100dvh-154px)]">
        <div
          className="max-h-full overflow-y-auto rounded-2xl bg-white shadow-sm p-4 space-y-2"
        >
          <div className="text-sm text-gray-500">
            Please read these agreement carefully before proceeding.
          </div>

          {/* Title */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Issued by Joshful Apps Private Limited
            </p>
          </div>

          {/* 1 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">1. Parties</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              This Agreement is between Joshful Apps Private Limited (“InstaYaar”) and the Client booking services
              through the platform.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">2. Platform Role</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              InstaYaar is a facilitator and not a service provider. Freelancers are independent professionals.
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">3. Bookings & Payments</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Clients must pay 100% advance. Payments are held in a platform-managed escrow/nodal account until
              service completion.
            </p>
          </section>

          {/* 4 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">4. Pricing & Invoices</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Prices are set by freelancers and Invoices are also provided by them directly. InstaYaar may issue payment
              receipts.
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">5. Cancellations & Refunds</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Refunds are processed only in eligible cases as per platform policies within 5–7 working days.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              For Direct Bookings via Availability Calendar, Freelancers can set their own Cancellation Policy clearly
              visible to Clients before booking. In such cases of cancellation by Clients, the platform will follow the
              Freelancers Policy.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              For Job Posts, 50% Refund is done incase of Cancellation by Client at least 48 hours before Job start time,
              100% thereafter.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              For Instant Bookings, no cancellation permitted once booked.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">6. Safety & Conduct</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Clients must provide a safe environment and clear requirements.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">7. Reviews</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Clients may submit honest reviews. Abuse or false reviews are prohibited.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">8. Limitation of Liability</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              InstaYaar is not liable for service quality or disputes beyond the platform fee.
            </p>
          </section>

          {/* 9 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">9. Termination</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              InstaYaar may suspend or terminate access for misuse or fraud.
            </p>
          </section>

          {/* 10 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">10. Governing Law</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              This Agreement is governed by Indian law. Jurisdiction: Kolkata, West Bengal.
            </p>
          </section>
          <br />
          <br />
          <div className="mt-4 mb-2">
            <p className="text-sm font-medium text-gray-800">
              Signature Required
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Please sign in the box below using your finger or mouse.
              This signature confirms that you have read and agree to the
              InstaYaar Freelancer Agreement.
            </p>
          </div>

          <AgreementSignature ref={signatureRef} onChange={setHasSignature} />
          <p className="text-[11px] text-gray-500 text-center mt-2">
            Make sure your signature is clearly visible before continuing.
          </p>

        </div>
      </div>


      {/* Bottom Action */}
      <div className="sticky bottom-0  bg-white border-t px-4 h-24 flex flex-col justify-center space-y-3">
        <div className="flex items-start gap-2">
          <Checkbox id="agree" checked={checked} onCheckedChange={(value) => setChecked(!!value)}
          />
          <label htmlFor="agree" className="text-sm text-gray-600 leading-snug">
            I agree to the{" "}
            <span className="font-medium text-gray-900">
              InstaYaar Client Agreement
            </span>
          </label>
        </div>

        <Button
          size="sm"
          className="w-full rounded-xl  hover:opacity-90"
          disabled={!checked || !hasSignature}
          onClick={handleSubmit}
        >
          Agree & Continue
        </Button>
      </div>
    </div >
  );
};

export default ClientAgreement;

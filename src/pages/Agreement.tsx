import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { freelancerChangeAgreement } from "@/store/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AgreementSignature, { AgreementSignatureRef } from "@/components/AgreementSignature";


const Agreement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const signatureRef = useRef<AgreementSignatureRef>(null);
  const [checked, setChecked] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const handleSubmit = () => {
    const signatureBase64 = signatureRef.current.getSignature();
    dispatch(freelancerChangeAgreement(signatureBase64, navigate))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm h-14 px-4 flex items-center gap-3">
        {/* <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button> */}
        <p className="text-lg font-semibold">InstaYaar Freelancer Agreement</p>
      </div>

      {/* Content */}
      <div className=" px-4 py-4 overflow-hidden  h-[calc(100dvh-154px)]">
        <div
          className="max-h-full overflow-y-auto rounded-2xl bg-white shadow-sm p-4 space-y-2"        >
          <div className="text-sm text-gray-500">
            Please read these agreement carefully before proceeding.
          </div>

          {/* Title */}
          <div className="space-y-1">
            {/* <h2 className="text-lg font-semibold text-gray-900">
              Kaamdham Freelancer Agreement
            </h2> */}
            <p className="text-sm text-gray-600">
              Issued by Joshful Apps Private Limited
            </p>
          </div>

          {/* 1 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">1. Parties</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              This Agreement is entered into between Joshful Apps Private Limited (“Instayaar” or “Platform”) and the
              individual/entity registering as a Freelancer.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">2. Nature of Relationship</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Instayaar is a technology platform and facilitator only. Freelancers are independent service providers and
              not employees, agents, or partners of Instayaar.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              Instayaar provides a digital marketplace, booking tools, communication features, and platform-managed payment
              handling.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              Instayaar does not guarantee services of same standard, as every freelancer has their own style and processes.
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">3. Scope of Platform Services</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Instayaar provides a digital marketplace, booking tools, communication features, and platform-managed payment
              handling.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              Instayaar does not guarantee services. However, the platform takes action as per feedback, including account
              suspension.
            </p>
          </section>

          {/* 4 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">4. Booking & Work Modes</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Freelancers may receive bookings through:
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              a) Instant Requests (real-time bidding)
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              b) Direct Bookings (as per availability calendar)
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              c) Job Posts (apply & bid)
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">5. Payment Handling & Escrow</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              All client payments are collected upfront by Instayaar and held in a platform-managed account until service
              completion. An Escrow account may be used, if required. Freelancers must not accept direct payments.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              For Direct Bookings, Freelancers can set their own Cancellation Policy clearly visible to Clients before
              booking. In such cases of cancellation by Clients, the platform will follow the Freelancers Policy.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              For Job Posts, 50% Refund is done in case of Cancellation by Client at least 48 hours before Job start time, no
              refund thereafter.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              For Instant Bookings, no cancellation permitted once booked.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">6. Platform Fee</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Instayaar charges a platform fee (currently 15% inclusive of GST) deducted from earnings. Invoice for this
              Platform Fee is issued by the Platform to the Freelancer.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              Invoice for the Full Amount of Service has to be issued by the Freelancer to the Client directly.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">7. Payouts</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Payouts are added to the wallet, 48 hours after job completion. Withdrawal can be done as per requirement or a
              weekly auto-payout can be setup.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">8. Taxes & Compliance</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Freelancers are solely responsible for all applicable taxes and statutory compliances. Instayaar may deduct
              TDS as per law.
            </p>
          </section>

          {/* 9 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">9. Conduct & Cancellations</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              No-shows, frequent cancellations, or unprofessional conduct may result in suspension or termination.
            </p>
          </section>

          {/* 10 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">10. Liability</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Freelancers are responsible for service quality, safety, tools, and compliance. Instayaar is not liable for
              disputes or damages.
            </p>
          </section>

          {/* 11 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">11. Suspension & Termination</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Instayaar reserves the right to suspend or terminate accounts for policy violations.
            </p>
          </section>

          {/* 12 */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-800">12. Governing Law</h3>
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
              InstaYaar Freelancer Agreement
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
    </div>
  );
};

export default Agreement;

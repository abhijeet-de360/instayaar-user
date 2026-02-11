import SignatureCanvas from "react-signature-canvas";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Button } from "@/components/ui/button";

export type AgreementSignatureRef = {
  getSignature: () => string | null;
  clear: () => void;
  isEmpty: () => boolean;
};

type Props = {
  onChange?: (hasSignature: boolean) => void;
};

const AgreementSignature = forwardRef<AgreementSignatureRef, Props>(
  ({ onChange }, ref) => {
    const sigRef = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
      getSignature() {
        if (!sigRef.current || sigRef.current.isEmpty()) return null;

        // ✅ FIX: use getCanvas(), not getTrimmedCanvas()
        return sigRef.current
          .getCanvas()
          .toDataURL("image/png");
      },
      clear() {
        sigRef.current?.clear();
        onChange?.(false);
      },
      isEmpty() {
        return sigRef.current?.isEmpty() ?? true;
      },
    }));

    return (
      <div className="space-y-3">
        <div className="border rounded-xl bg-white overflow-hidden">
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{
              className: "w-full h-48 touch-none bg-white",
            }}
            onEnd={() => onChange?.(!sigRef.current?.isEmpty())}
          />
        </div>

        <Button
          variant="outline"
          onClick={() => {
            sigRef.current?.clear();
            onChange?.(false);
          }}
        >
          Clear Signature
        </Button>
      </div>
    );
  }
);

export default AgreementSignature;

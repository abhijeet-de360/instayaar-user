import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "../layout/Header"

const DataDeletion = () => {
  const [contact, setContact] = useState("")
  const [error, setError] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false)
  const { toast } = useToast()

  const handleSubmit = () => {
    setOpenConfirm(false)
    toast({
      title: "Request Submitted",
      description: "Our team will connect with you shortly.",
    })
    setContact("")
  }

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    // Allow email characters OR digits
    if (!/^[0-9a-zA-Z@._-]*$/.test(value)) {
      e.currentTarget.value = contact;
    }
  };


  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setContact(value);

    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setError("");
    } else if (phoneRegex.test(value)) {
      setError("");
    } else if (emailRegex.test(value)) {
      setError("");
    } else {
      setError("Enter a valid email or 10-digit phone number");
    }
  };

  return (
    <>
      <div className="md:hidden">
        <Header />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Data Deletion Policy</h1>
        <p className="text-muted-foreground mb-6">Last Updated: 01 Sep 2025</p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          <section>
            <p>
              At <strong>InstaYaar</strong>, we respect your right to control your personal data. This Data Deletion
              Policy explains how you can request the removal of your account and associated personal information from
              our systems. By submitting a deletion request, you acknowledge that certain data may still need to be
              retained as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">1. How to Request Data Deletion</h2>
            <p>
              You may request deletion of your data at any time by submitting your registered email address or phone
              number below. Once we receive your request, our support team will reach out to verify your identity before
              proceeding with the deletion.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="w-full">
                <Input
                  placeholder="Enter email or phone number"
                  value={contact}
                  className="flex-1"
                  onInput={handleInput}
                  onChange={handleContactChange}
                />
                {error && <small className="text-red-500 text-xs mt-1">{error}</small>}
              </div>
              <Button
                disabled={!contact || !!error}
                onClick={() => setOpenConfirm(true)}
              >
                Request Deletion
              </Button>

            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Verification Process</h2>
            <p>
              For your security, we may require you to confirm ownership of the account through a verification code sent
              to your email or phone number. This ensures that only the rightful owner of the account can request its
              deletion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Processing Timeline</h2>
            <p>
              Once verified, we will process your request within <strong>7–10 business days</strong>. You will receive a
              confirmation once the deletion has been completed. During this period, you may withdraw your request by
              contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Exceptions</h2>
            <p>
              Please note that we may retain certain data even after account deletion in order to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Comply with legal obligations (e.g., tax, audit, and regulatory requirements).</li>
              <li>Maintain transaction history for dispute resolution and fraud prevention.</li>
              <li>Retain anonymized or aggregated data that cannot identify you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
            <p>
              If you have questions regarding this Data Deletion Policy or need help with your request, please contact
              our support team at{" "}
              <a href="mailto:hello@instayaar.com" className="text-primary underline">
                hello@instayaar.com
              </a>
              .
            </p>
          </section>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion Request</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              You are requesting deletion for <strong>{contact}</strong>. Are you sure you want to continue?
            </p>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSubmit}>
                Confirm & Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default DataDeletion

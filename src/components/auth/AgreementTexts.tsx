export const ClientAgreementText = () => (
  <div className="space-y-5 text-sm text-foreground/80 py-2">
    <div className="space-y-1 pb-2 border-b">
      <h2 className="text-base font-semibold text-foreground">InstaYaar Client Agreement</h2>
      <p className="text-xs text-muted-foreground">Issued by Joshful Apps Private Limited</p>
    </div>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
        Parties
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        This Agreement is between Joshful Apps Private Limited (“Instayaar”) and the Client booking services through the platform.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
        Platform Role
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        InstaYaar acts as a digital marketplace connecting clients with independent freelancers (Yaars). We facilitate bookings, communication, and secure platform-managed payments. Yaars operate independently and are not employees of InstaYaar.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
        Bookings & Payments
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        Clients are required to pay a 100% advance for services. These payments are securely held in a platform-managed account until the requested service is successfully completed.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">4</span>
        Safety & Conduct
      </h3>
      <div className="text-sm leading-relaxed text-muted-foreground pl-7 space-y-2">
        <p>Clients must ensure a safe working environment and provide clear, precise requirements for tasks.</p>
        <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-100 flex gap-2 items-start mt-2">
          <span>⚠️</span>
          <p><strong>Objectionable content is strictly prohibited.</strong> You are responsible for ensuring that any tasks you post, or communications you engage in, fully comply with our community guidelines and are appropriate for all users.</p>
        </div>
      </div>
    </section>
    
    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">5</span>
        Account & Liability
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        InstaYaar is not liable for service quality or disputes beyond the platform fee. We reserve the right to suspend or terminate access in cases of misuse, fraud, or policy violations.
      </p>
    </section>
  </div>
);

export const FreelancerAgreementText = () => (
  <div className="space-y-5 text-sm text-foreground/80 py-2">
    <div className="space-y-1 pb-2 border-b">
      <h2 className="text-base font-semibold text-foreground">InstaYaar Freelancer Agreement</h2>
      <p className="text-xs text-muted-foreground">Issued by Joshful Apps Private Limited</p>
    </div>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
        Parties
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        This Agreement is entered into between Joshful Apps Private Limited (“Instayaar” or “Platform”) and the individual/entity registering as a Freelancer.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
        Platform Role
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        InstaYaar is a technology platform connecting clients with skilled professionals. As a Yaar, you operate as an independent service provider and are not an employee of InstaYaar.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
        Payments & Fees
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        Client payments are collected upfront and secured in a platform-managed account. InstaYaar charges a standard platform fee (currently 15% inclusive of GST) which is automatically deducted from your earnings upon task completion.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">4</span>
        Professional Conduct
      </h3>
      <div className="text-sm leading-relaxed text-muted-foreground pl-7 space-y-2">
        <p>You are expected to maintain high professional standards. Frequent cancellations, no-shows, or unprofessional conduct may lead to account suspension.</p>
        <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-100 flex gap-2 items-start mt-2">
          <span>⚠️</span>
          <p><strong>Objectionable content is strictly prohibited.</strong> Do not engage with or fulfill requests that violate community guidelines. Please report any such instances immediately.</p>
        </div>
      </div>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs">5</span>
        Account & Liability
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
        As a Yaar, you are responsible for the quality of your services, your own tools, and safety. InstaYaar reserves the right to suspend or terminate accounts for repeated policy violations.
      </p>
    </section>
  </div>
);

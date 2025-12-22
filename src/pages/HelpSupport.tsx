import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  MessageCircle,
  Phone,
  Mail,
  Search,
  HelpCircle,
  FileText,
  Shield,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { localService } from "@/shared/_session/local";

const HelpSupport = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };

  const faqs = [
    {
      question: "How do I post a job?",
      answer:
        "To post a job, click on 'Post a Job' from your dashboard or header menu. Fill in the job details including title, category, budget, location, and description. Once submitted, your job will be visible to freelancers in your area.",
    },
    {
      question: "How do payments work?",
      answer:
        "Payments are processed securely through our platform. You can pay using UPI, credit/debit cards, or bank transfer. Payment is typically made after the service is completed and you're satisfied with the work.",
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer:
        "If you're not satisfied with the service, you can contact our support team within 24 hours of completion. We offer dispute resolution and may issue refunds based on our policy.",
    },
    {
      question: "How do I cancel a booking?",
      answer:
        "You can cancel a booking from your 'My Bookings' page. Cancellation policies may vary depending on the timing and service type. Check our cancellation policy for more details.",
    },
    {
      question: "How are freelancers verified?",
      answer:
        "All freelancers go through our verification process which includes identity verification, skill assessment, and background checks where applicable. You can also check their ratings and reviews from previous customers.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onLogin={handleLogin} />
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link to={`${localService?.get('role') === 'freelancer' ? "/freelancer-dashboard" : "/employer-dashboard"}`} className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Help & Support</span>
          </Link>
          {/* <Button size="sm" className="h-8 px-3">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button> */}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Mobile-optimized header */}
        {/* <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-sm text-muted-foreground">
            How can we help you today?
          </p>
        </div> */}

        {/* Search */}
        {/* <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help topics..."
                className="pl-10 text-sm"
              />
            </div>
          </CardContent>
        </Card> */}

        {/* Quick Contact Options - Mobile optimized single column */}
        <div className="space-y-3">
          {/* <h2 className="text-lg font-semibold">Contact Us</h2> */}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">Live Chat</h3>
                  <p className="text-xs text-muted-foreground">
                    Get instant support
                  </p>
                </div>
                <a href="/dispute">
                <Button size="sm" >Chat</Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">Call Us</h3>
                  <p className="text-xs text-muted-foreground">
                    +91 9073008080
                  </p>
                </div>
                <a href={'tel:9073008080'} target="_blank" className="border p-1 rounded-md font-medium px-2">
                  Call
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">Email</h3>
                  <p className="text-xs text-muted-foreground">
                    hello@kaamdham.com
                  </p>
                </div>
                <a href={'mailto:hello@kaamdham.com'} target="_blank" className="border p-1 rounded-md font-medium px-2">
                  Email
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b-0 last:border-b-0"
                  >
                    <AccordionTrigger className="text-sm text-left py-3 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-3">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        

        {/* Additional Resources */}
        <div className="space-y-3">
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">Terms & condition</h3>
                    <p className="text-xs text-muted-foreground">
                      Learn how to use our platform
                    </p>
                  </div>
                  <Link to={'/terms&condition'} target="_blank" className="border px-2 py-1 rounded-md font-medium">
                    View
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">Privacy Policy</h3>
                    <p className="text-xs text-muted-foreground">
                      Stay safe while using our services
                    </p>
                  </div>
                  <Link to={'/privacy-policy'} target="_blank" className="border px-2 py-1 rounded-md font-medium">
                    Read
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">Data Declaration</h3>
                    <p className="text-xs text-muted-foreground">
                      Stay safe while using our services
                    </p>
                  </div>
                  <Link to={'/data-deletion'} target="_blank" className="border px-2 py-1 rounded-md font-medium">
                    Read
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default HelpSupport;

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";
import Footer from '@/components/Footer/Footer';
import { Link } from 'react-router-dom';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const WebLanding = () => {

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768 && window.location.pathname !== "/") {
                window.location.href = "/";
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <>
            <div className="min-h-screen bg-primary flex flex-col md:flex-row items-center justify-between px-24 md:px-10 text-white">
                {/* Left side - mobile mockups */}

                <div className="flex flex-col md:flex-row gap-10 mt-10 md:mt-0">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center md:items-start"
                    >
                        <img
                            src="https://ik.imagekit.io/kaamdham/category/1768820427265-664218167_AKdMvdV72.jpg"
                            alt="Login Screen"
                            className="w-[280px] md:w-[500px] rounded-3xl shadow-2xl rotate-[-10deg]"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="https://ik.imagekit.io/kaamdham/category/1768820475872-907220645_GhT_IdDTA.jpg"
                            alt="Home Screen"
                            className="w-[400px] md:w-[500px] rounded-3xl shadow-2xl rotate-[5deg]"
                        />
                    </motion.div>
                </div>

                {/* Right section - text */}
                <div className="mt-12 md:mt-0 md:ml-10 text-center md:text-left max-w-md">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-5xl font-semibold text-white"
                    >
                        Find Work or Hire Talent Instantly
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-3xl md:text-4xl font-bold mt-2 text-yellow-300"
                    >
                        With <span className="text-white">InstaYaar</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-4 text-base text-gray-100 leading-relaxed"
                    >
                        A seamless platform where users can post jobs and services,
                        and freelancers can apply, collaborate, and grow.
                        Simple, transparent, and built for everyone.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-8 flex flex-col items-center md:items-start"
                    >
                        <p className="text-sm text-gray-200 mb-4">Download the InstaYaar App</p>
                        <div className="flex gap-4">
                            <a href="https://play.google.com/store/apps/details?id=com.instayaar.app&hl=en_IN" target='blank'>
                                <Button className="bg-black flex items-center gap-2 hover:bg-gray-800 cursor-pointer">
                                    <Play size={20} /> Google Play
                                </Button>
                            </a>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-black flex items-center gap-2 hover:bg-gray-800 relative">
                                        <Apple size={20} /> App Store
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle className='text-center'>Coming Soon </DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4 text-center text-sm text-muted-foreground">
                                        The App Store version of our app is coming soon. Stay tuned!
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button>Close</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </motion.div>
                </div>
                <Footer />

            </div>
            <footer className="w-full border-t py-3 px-6 text-sm text-muted-foreground hidden md:block">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-center md:text-left">
                        <Link to="/privacy-policy" className="hover:text-foreground transition-colors font-medium">
                            Privacy Policy
                        </Link>
                        <Link to="/terms&condition" className="hover:text-foreground transition-colors font-medium">
                            Terms & Conditions
                        </Link>
                        <Link to="/data-deletion" className="hover:text-foreground transition-colors font-medium">
                            Data Deletion Policy
                        </Link>
                    </div>

                    <p className="text-xs text-center md:text-right font-medium">
                        © {new Date().getFullYear()} InstaYaar. All rights reserved. Powered by Joshful Apps Private Limited.
                    </p>
                </div>
            </footer>
        </>
    )
}

export default WebLanding

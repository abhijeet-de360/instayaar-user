import { LoginModal } from "./LoginModal";
import { useAuthCheck } from "@/hooks/useAuthCheck";

export const CentralizedLoginModal = () => {
  const { showLoginModal, setShowLoginModal, handleLogin, isMobile } = useAuthCheck();

  return (
    <LoginModal
      isOpen={showLoginModal}
      onClose={setShowLoginModal}
      onLoginSuccess={handleLogin}
      isMobile={isMobile}
    />
  );
};
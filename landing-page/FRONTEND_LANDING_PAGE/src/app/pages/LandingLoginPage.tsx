import LandingPage from "./LandingPage";
import UnifiedLogin from "./UnifiedLogin";

export default function LandingLoginPage() {
  return <LandingPage loginSection={<UnifiedLogin embedded />} />;
}

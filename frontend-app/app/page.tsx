/**
 * Root route (/).
 * - Logged-in users are served from /feed (via NavBar link).
 * - Guests see the public landing page.
 * We simply render the landing page here; the NavBar "Sign in" / "Sign up"
 * buttons take authenticated users to /feed.
 */
import LandingPage from "./landing/page";

export default function HomePage() {
  return <LandingPage />;
}

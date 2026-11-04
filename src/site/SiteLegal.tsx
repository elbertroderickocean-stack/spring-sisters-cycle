import SiteLayout from "./SiteLayout";

const Doc = ({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) => (
  <SiteLayout>
    <article className="mx-auto max-w-3xl px-5 pb-10 pt-36 md:px-8">
      <h1 className="text-5xl font-semibold tracking-[-0.04em] md:text-6xl">{title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: {updated} · Draft — pending legal review</p>
      <div className="mt-12 space-y-8 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground">
        {children}
      </div>
    </article>
  </SiteLayout>
);

export function Privacy() {
  return (
    <Doc title="Privacy Policy" updated="November 2026">
      <section><h2>What we collect</h2><p>Account details (name, email), the profile you share in onboarding (age range, skin type, cycle details, life stage), photos you take for skin scans, products you scan, and — only with your explicit permission — health data such as sleep, heart rate, activity and glucose from Apple Health or connected devices. We also use approximate location to get local weather and UV.</p></section>
      <section><h2>How we use it</h2><p>Only to build and improve your personal skincare routine and to run the service. We do not sell your personal data and we do not use your health data for advertising.</p></section>
      <section><h2>Health data</h2><p>Health data accessed through Apple HealthKit is never shared with third parties for marketing and is used only to provide in-app recommendations. You can revoke access at any time in your device settings.</p></section>
      <section><h2>Skin photos</h2><p>Scan photos are processed to estimate visible skin signs. They are stored securely and you can delete them at any time.</p></section>
      <section><h2>Service providers</h2><p>We use trusted providers for hosting, authentication and AI processing. They process data on our behalf under contractual confidentiality obligations.</p></section>
      <section><h2>Your rights</h2><p>You can access, export, correct or delete your data, and delete your account at any time. California residents have additional rights under the CCPA/CPRA, including the right to know and to delete.</p></section>
      <section><h2>Children</h2><p>meanwhile is not intended for anyone under 16.</p></section>
      <section><h2>Contact</h2><p>Questions about privacy: privacy@meanwhilecare.com</p></section>
    </Doc>
  );
}

export function Terms() {
  return (
    <Doc title="Terms & Medical Disclaimer" updated="November 2026">
      <section><h2>Not medical advice</h2><p>meanwhile is a wellness and skincare guidance service. It is not a medical device and does not diagnose, treat, cure or prevent any disease. Recommendations from m.i. are general information, not a substitute for advice from a dermatologist or other qualified healthcare provider. If you have a skin condition, are pregnant, or take medication, consult your doctor before changing your routine.</p></section>
      <section><h2>Skin scans</h2><p>Scans estimate visible signs from a photo. Results depend on lighting and camera and may be inaccurate.</p></section>
      <section><h2>Products</h2><p>Always patch-test new products. Stop use and consult a professional if irritation occurs. Product statements have not been evaluated by the FDA.</p></section>
      <section><h2>Subscriptions</h2><p>Paid plans renew automatically until canceled. You can cancel any time in your App Store settings.</p></section>
      <section><h2>Contact</h2><p>hello@meanwhilecare.com</p></section>
    </Doc>
  );
}

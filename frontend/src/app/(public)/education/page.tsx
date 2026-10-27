import { permanentRedirect } from 'next/navigation';

// Public /education route redirecting to /experience#education section. Permanent (308), since
// education content has always lived on /experience — this route exists only to catch old links.
export default function PublicEducationPage() {
  permanentRedirect('/experience#education');
}

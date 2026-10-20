import { redirect } from 'next/navigation';

// Public /education route redirecting to /experience#education section.
export default function PublicEducationPage() {
  redirect('/experience#education');
}

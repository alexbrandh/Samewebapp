// Redirect to login page with signup mode
import { redirect } from 'next/navigation';

export default function RegisterPage() {
    redirect('/account/login?mode=signup');
}

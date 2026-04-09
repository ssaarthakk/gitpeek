'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyViewerEmail(formData: FormData) {
    const email = formData.get('email') as string;
    const shareId = formData.get('shareId') as string;

    if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address.');
    }

    (await cookies()).set('gitpeek_viewer_email', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
    });

    redirect(`/view/${shareId}`);
}
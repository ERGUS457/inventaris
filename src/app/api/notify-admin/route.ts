import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, companyName } = await request.json();

    const superadminEmail = process.env.SUPERADMIN_EMAIL;
    if (!superadminEmail) {
      return NextResponse.json({ error: "SUPERADMIN_EMAIL not configured" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://inventaris-theta.vercel.app";

    const { error } = await resend.emails.send({
      from: "Inventaris App <onboarding@resend.dev>",
      to: superadminEmail,
      subject: `🆕 Pendaftaran Baru: ${companyName || email}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E9EDF7;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4318FF, #868CFF); padding: 32px 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
              📋 INVENTARIS APP
            </h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">
              Notifikasi Pendaftaran Baru
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 24px;">
            <div style="background: #FFF8E1; border-left: 4px solid #FFB547; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #8B6914; font-weight: 600;">
                ⏳ Ada pengguna baru yang menunggu verifikasi Anda!
              </p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4F7FE; color: #A3AED0; font-size: 13px; font-weight: 600; width: 120px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4F7FE; color: #2B3674; font-size: 14px; font-weight: 700;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4F7FE; color: #A3AED0; font-size: 13px; font-weight: 600;">Perusahaan</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F4F7FE; color: #2B3674; font-size: 14px; font-weight: 700;">${companyName || "Tidak disebutkan"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #A3AED0; font-size: 13px; font-weight: 600;">Waktu Daftar</td>
                <td style="padding: 12px 0; color: #2B3674; font-size: 14px; font-weight: 700;">${new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}</td>
              </tr>
            </table>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${appUrl}/users" 
                 style="display: inline-block; background: linear-gradient(135deg, #4318FF, #6B4CFF); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 8px 24px rgba(67,24,255,0.3);">
                Verifikasi Sekarang →
              </a>
            </div>

            <p style="color: #A3AED0; font-size: 12px; text-align: center; margin: 0;">
              Klik tombol di atas untuk membuka halaman Kelola Pengguna dan memverifikasi akun ini.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F4F7FE; padding: 16px 24px; text-align: center;">
            <p style="color: #A3AED0; font-size: 11px; margin: 0;">
              Email ini dikirim otomatis oleh Inventaris App. Jangan membalas email ini.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify error:", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}

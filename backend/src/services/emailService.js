import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, username, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  try {
    await resend.emails.send({
      from: "La Synthèse <onboarding@resend.dev>", // to change in production
      to: email,
      subject: "Verify your email - La Synthèse",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #beff05;">Welcome to La Synthèse, ${username}! ∿ </h1>
          <p>Click the link below to verify your email:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #beff05; color: #000; text-decoration: none; border-radius: 8px;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
        </div>
      `,
    });

    console.log("✅ Verification email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

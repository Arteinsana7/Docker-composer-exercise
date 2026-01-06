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

export const sendPasswordResetEmail = async (email, username, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  try {
    await resend.emails.send({
      from: "La Synthèse <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password - La Synthèse",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #beff05;">Password Reset Request ∿</h1>
          <p>Hello <strong>${username}</strong>,</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #beff05; color: #0a0f3d; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <p>- La Synthèse Team ∿</p>
        </div>
      `,
    });

    console.log("✅ Password reset email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending reset email:", error);
    throw error;
  }
};

export const sendPasswordChangedEmail = async (email, username) => {
  try {
    await resend.emails.send({
      from: "La Synthèse <onboarding@resend.dev>",
      to: email,
      subject: "Password Changed - La Synthèse",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #beff05;">Password Successfully Changed ∿</h1>
          <p>Hello <strong>${username}</strong>,</p>
          <p>Your password has been successfully changed.</p>
          <p style="color: #999; font-size: 14px;">If you didn't make this change, please contact us immediately.</p>
          <p>- La Synthèse Team ∿</p>
        </div>
      `,
    });

    console.log("✅ Password changed confirmation sent to:", email);
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error);
    throw error;
  }
};

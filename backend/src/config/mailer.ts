import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import { logger } from "./logger";

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Email Templates ──────────────────────────────────────────────────────────

const templates: Record<string, string> = {
  otp: `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">DSS Nexus Commerce</h1>
      </div>
      <div style="padding:32px">
        <h2 style="color:#111827;margin:0 0 8px">Hi {{name}},</h2>
        <p style="color:#6b7280;margin:0 0 24px">Use the OTP below to verify your email. It expires in {{expiresIn}} minutes.</p>
        <div style="background:#f9fafb;border:2px dashed #d1fae5;border-radius:8px;padding:24px;text-align:center;margin:0 0 24px">
          <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#16a34a">{{otp}}</span>
        </div>
        <p style="color:#9ca3af;font-size:14px;margin:0">If you didn't request this, ignore this email.</p>
      </div>
    </div>
  `,
  "password-reset": `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">Password Reset</h1>
      </div>
      <div style="padding:32px">
        <h2 style="color:#111827;margin:0 0 8px">Hi {{name}},</h2>
        <p style="color:#6b7280;margin:0 0 24px">Use this OTP to reset your password. Expires in {{expiresIn}} minutes.</p>
        <div style="background:#eff6ff;border:2px dashed #bfdbfe;border-radius:8px;padding:24px;text-align:center;margin:0 0 24px">
          <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#2563eb">{{otp}}</span>
        </div>
        <p style="color:#9ca3af;font-size:14px;margin:0">If you didn't request this, your account may be at risk. Please secure it immediately.</p>
      </div>
    </div>
  `,
  "order-confirmed": `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
      <div style="background:#16a34a;padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0">Order Confirmed! 🎉</h1>
      </div>
      <div style="padding:32px">
        <p>Hi {{name}}, your order <strong>#{{orderNumber}}</strong> has been confirmed.</p>
        <p>Total: <strong>₹{{total}}</strong></p>
        <p>Estimated delivery: <strong>{{estimatedDelivery}}</strong></p>
      </div>
    </div>
  `,
};

// ─── Send Email ───────────────────────────────────────────────────────────────

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const templateString = templates[options.template];
    if (!templateString) {
      logger.warn(`Email template '${options.template}' not found`);
      return;
    }

    const compiled = Handlebars.compile(templateString);
    const html = compiled(options.data);

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "DSS Nexus Commerce <noreply@dssnexus.com>",
      to: options.to,
      subject: options.subject,
      html,
    });

    logger.info(`Email sent to ${options.to} — ${options.subject}`);
  } catch (error) {
    logger.error("Email send failed:", error);
    // Don't throw — email failures shouldn't break the flow
  }
};

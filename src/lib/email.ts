import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string,
  name: string
) {
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set. Skipping email send. Verification URL:", verificationUrl);
    return;
  }

  const resend = getResendClient();
  if (!resend) {
    console.error("Failed to initialize Resend client");
    throw new Error("Email service not configured");
  }
  
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verify your TicketSaaS account",
      html: getVerificationEmailHtml(verificationUrl, name),
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPurchaseConfirmationEmail(
  buyerEmail: string,
  buyerName: string,
  ticketTitle: string,
  quantity: number,
  totalPrice: number,
  eventDate: Date,
  location: string
) {
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set. Skipping purchase confirmation email.");
    return;
  }

  const resend = getResendClient();
  if (!resend) {
    console.error("Failed to initialize Resend client");
    return;
  }
  
  try {
    await resend.emails.send({
      from: fromEmail,
      to: buyerEmail,
      subject: `Purchase Confirmation - ${ticketTitle}`,
      html: getPurchaseConfirmationEmailHtml(buyerName, ticketTitle, quantity, totalPrice, eventDate, location),
    });
  } catch (error) {
    console.error("Failed to send purchase confirmation email:", error);
  }
}

export async function sendSaleNotificationEmail(
  sellerEmail: string,
  sellerName: string,
  ticketTitle: string,
  quantity: number,
  totalPrice: number,
  buyerName: string
) {
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set. Skipping sale notification email.");
    return;
  }

  const resend = getResendClient();
  if (!resend) {
    console.error("Failed to initialize Resend client");
    return;
  }
  
  try {
    await resend.emails.send({
      from: fromEmail,
      to: sellerEmail,
      subject: `Ticket Sale Notification - ${ticketTitle}`,
      html: getSaleNotificationEmailHtml(sellerName, ticketTitle, quantity, totalPrice, buyerName),
    });
  } catch (error) {
    console.error("Failed to send sale notification email:", error);
  }
}

function getVerificationEmailHtml(verificationUrl: string, name: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🎫 TicketSaaS</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Welcome${name ? `, ${name}` : ""}!</h2>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                Thank you for signing up for TicketSaaS. To complete your registration and start buying and selling tickets, please verify your email address.
              </p>
              <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                Click the button below to verify your email:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 10px 0 0; color: #667eea; font-size: 14px; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
              
              <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                If you didn't create an account with TicketSaaS, you can safely ignore this email.
              </p>
              <p style="margin: 10px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                This verification link will expire in 24 hours.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; text-align: center; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} TicketSaaS. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function getPurchaseConfirmationEmailHtml(
  buyerName: string,
  ticketTitle: string,
  quantity: number,
  totalPrice: number,
  eventDate: Date,
  location: string
): string {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🎫 TicketSaaS</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Purchase Confirmed!</h2>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                Hi ${buyerName},
              </p>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                Thank you for your purchase! Your tickets have been confirmed.
              </p>
              
              <!-- Purchase Details -->
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px;">📋 Order Details</h3>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Event:</td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${ticketTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Quantity:</td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${quantity} ticket${quantity > 1 ? 's' : ''}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Total Price:</td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">$${totalPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Event Date:</td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Location:</td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${location}</td>
                  </tr>
                </table>
              </div>
              
              <p style="margin: 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                You can view your tickets and QR codes in your dashboard. Please present your QR code at the event entrance for entry.
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
              
              <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                If you have any questions about your purchase, please contact support.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; text-align: center; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} TicketSaaS. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function getSaleNotificationEmailHtml(
  sellerName: string,
  ticketTitle: string,
  quantity: number,
  totalPrice: number,
  buyerName: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket Sale Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🎫 TicketSaaS</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">🎉 Your Tickets Have Been Sold!</h2>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                Hi ${sellerName},
              </p>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                Great news! Your tickets have been purchased.
              </p>
              
              <!-- Sale Details -->
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px;">💰 Sale Details</h3>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Event:</td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${ticketTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Quantity Sold:</td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${quantity} ticket${quantity > 1 ? 's' : ''}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Sale Amount:</td>
                    <td style="padding: 8px 0; color: #10b981; font-size: 18px; font-weight: 700; text-align: right;">$${totalPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Buyer:</td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${buyerName}</td>
                  </tr>
                </table>
              </div>
              
              <p style="margin: 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                You can view all your sales and manage your listings in your dashboard.
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
              
              <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                Thank you for using TicketSaaS to sell your tickets!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; text-align: center; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} TicketSaaS. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

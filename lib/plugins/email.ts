import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export interface SendPluginReceiptEmailInput {
  toEmail: string;
  pluginTitle: string;
  amountPaid: number;
  downloadUrl: string;
}

export async function sendPluginReceiptEmail(input: SendPluginReceiptEmailInput): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: input.toEmail,
    subject: `Your download: ${input.pluginTitle}`,
    text: `Thanks for your purchase of ${input.pluginTitle} (₦${input.amountPaid.toLocaleString()}).\n\nDownload it here: ${input.downloadUrl}\n\nLost this link later? Request it again at https://www.okata-miracle.site/animate/resources/plugins/redownload`,
    html: `
      <p>Thanks for your purchase of <strong>${input.pluginTitle}</strong> (₦${input.amountPaid.toLocaleString()}).</p>
      <p><a href="${input.downloadUrl}">Download it here</a></p>
      <p>Lost this link later? <a href="https://www.okata-miracle.site/animate/resources/plugins/redownload">Request it again</a>.</p>
    `,
  });
}

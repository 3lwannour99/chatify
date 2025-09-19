import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "welcome to chatify!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });
console.log("From field:", `${sender.name} <${sender.email}>`);

  if (error) {
    console.log("Error sendeing welcome email:", error);
    throw new Error("Faild to send welcome email");
  }

  console.log("welcome Email sent successfully", data);
};

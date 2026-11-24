import { render } from "@react-email/components";
import {
  ContactNotificationEmail,
  type ContactNotificationEmailProps,
} from "./ContactNotificationEmail";
import { ContactAutoReplyEmail } from "./ContactAutoReplyEmail";

export type ContactEmailTemplateProps = ContactNotificationEmailProps;

export async function renderContactEmails(
  props: ContactEmailTemplateProps
): Promise<{ notificationHtml: string; autoReplyHtml: string }> {
  const [notificationHtml, autoReplyHtml] = await Promise.all([
    render(<ContactNotificationEmail {...props} />),
    render(<ContactAutoReplyEmail {...props} />),
  ]);

  return { notificationHtml, autoReplyHtml };
}

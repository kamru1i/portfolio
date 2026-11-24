import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { ContactNotificationEmailProps } from "./ContactNotificationEmail";

export function ContactAutoReplyEmail({
  cleanName,
  cleanEmail,
  cleanCompany,
  cleanProjectType,
  cleanBudget,
  cleanTimeline,
  cleanDetails,
  submissionTimeDhaka,
}: ContactNotificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        Thank you, {cleanName}. Your project enquiry has been received.
      </Preview>
      <Body style={bodyStyle}>
        <Container style={cardStyle}>
          <Section style={headerStyle}>
            <Text style={statusBadgeStyle}>● ENQUIRY RECEIVED</Text>
            <Heading as="h1" style={titleStyle}>
              Thank you, {cleanName}.
            </Heading>
            <Text style={subtitleStyle}>
              Your project enquiry has been received by Kamrul Islam.
            </Text>
          </Section>

          <Section style={reviewBannerStyle}>
            <Row>
              <Column style={{ width: "36px", verticalAlign: "top" }}>
                <Text style={checkCircleStyle}>✓</Text>
              </Column>
              <Column style={{ verticalAlign: "top" }}>
                <Text style={reviewTitleStyle}>
                  Under Review — Expected Response Within 24–48 Hours
                </Text>
                <Text style={reviewDescStyle}>
                  I review client briefs daily and will reply directly to{" "}
                  <strong style={{ color: "#ffffff" }}>{cleanEmail}</strong> regarding
                  availability, scoping, and next steps.
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={contentStyle}>
            <Text style={sectionLabelStyle}>Summary of Your Submission</Text>

            <Row style={metaRowStyle}>
              <Column style={labelColStyle}>Service Requested:</Column>
              <Column style={{ ...valueColStyle, fontWeight: "500" }}>
                {cleanProjectType}
              </Column>
            </Row>
            <Row style={metaRowStyle}>
              <Column style={labelColStyle}>Timeline:</Column>
              <Column style={valueColStyle}>{cleanTimeline}</Column>
            </Row>
            <Row style={metaRowStyle}>
              <Column style={labelColStyle}>Budget Range:</Column>
              <Column style={valueColStyle}>{cleanBudget}</Column>
            </Row>
            <Row style={metaRowStyle}>
              <Column style={labelColStyle}>Company:</Column>
              <Column style={valueColStyle}>{cleanCompany}</Column>
            </Row>

            <Section style={{ marginTop: "16px", marginBottom: "24px" }}>
              <Text style={{ ...sectionLabelStyle, marginBottom: "8px" }}>
                Your Project Brief
              </Text>
              <Text style={briefBoxStyle}>{cleanDetails}</Text>
            </Section>

            <Section style={warningBoxStyle}>
              <Text style={warningTitleStyle}>
                ⚠ AUTOMATED NO-REPLY NOTIFICATION
              </Text>
              <Text style={warningTextStyle}>
                This message was generated automatically from an unmonitored address (
                <strong style={{ color: "#ffffff" }}>noreply@kamrulislam.me</strong>).{" "}
                <strong>Please do not reply directly to this email</strong>, as incoming
                replies cannot be received or monitored.
              </Text>
              <Text style={{ ...warningTextStyle, marginTop: "10px" }}>
                If you need to send additional project attachments or have urgent
                questions before I respond, please email directly to:{" "}
                <Link href="mailto:hello@kamrulislam.me" style={linkStyle}>
                  hello@kamrulislam.me
                </Link>
                .
              </Text>
            </Section>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Received: {submissionTimeDhaka} (GMT+6)
            </Text>
            <Text style={{ ...footerTextStyle, color: "#888888", marginTop: "4px" }}>
              Kamrul Islam · Video Editor, AI-Assisted Content Creator, Web Developer &amp; IT Professional
            </Text>
            <Text style={{ ...footerTextStyle, marginTop: "2px" }}>
              <Link
                href="https://kamrulislam.me"
                style={{ color: "#a1a1a1", textDecoration: "none" }}
              >
                kamrulislam.me
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  margin: "0",
  padding: "32px 16px",
  backgroundColor: "#080808",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  color: "#ededed",
};

const cardStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#121212",
  border: "1px solid #262626",
  borderRadius: "16px",
  overflow: "hidden" as const,
};

const headerStyle = {
  padding: "28px 32px",
  borderBottom: "1px solid #222222",
  backgroundColor: "#181818",
};

const statusBadgeStyle = {
  margin: "0 0 12px 0",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  color: "#10b981",
  fontFamily: "monospace",
  fontWeight: "600",
};

const titleStyle = {
  margin: "0",
  fontSize: "24px",
  fontWeight: "600",
  color: "#ffffff",
  letterSpacing: "-0.02em",
  lineHeight: "1.25",
};

const subtitleStyle = {
  margin: "8px 0 0 0",
  fontSize: "14px",
  color: "#a1a1a1",
  lineHeight: "1.5",
};

const reviewBannerStyle = {
  padding: "22px 32px",
  backgroundColor: "#141414",
  borderBottom: "1px solid #222222",
};

const checkCircleStyle = {
  margin: "0",
  width: "28px",
  height: "28px",
  borderRadius: "9999px",
  backgroundColor: "rgba(16, 185, 129, 0.15)",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  textAlign: "center" as const,
  lineHeight: "28px",
  fontSize: "14px",
  color: "#10b981",
};

const reviewTitleStyle = {
  margin: "0 0 4px 0",
  fontSize: "13px",
  fontWeight: "600",
  color: "#ffffff",
};

const reviewDescStyle = {
  margin: "0",
  fontSize: "13px",
  color: "#999999",
  lineHeight: "1.5",
};

const contentStyle = {
  padding: "28px 32px",
};

const sectionLabelStyle = {
  margin: "0 0 14px 0",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  color: "#888888",
  fontFamily: "monospace",
};

const metaRowStyle = {
  marginBottom: "8px",
};

const labelColStyle = {
  width: "140px",
  color: "#888888",
  fontSize: "13px",
  fontFamily: "monospace",
  verticalAlign: "top" as const,
  paddingBottom: "6px",
};

const valueColStyle = {
  color: "#ffffff",
  fontSize: "14px",
  verticalAlign: "top" as const,
  paddingBottom: "6px",
};

const briefBoxStyle = {
  margin: "0",
  backgroundColor: "#181818",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  padding: "16px",
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#d4d4d4",
  whiteSpace: "pre-wrap" as const,
  wordBreak: "break-word" as const,
};

const warningBoxStyle = {
  backgroundColor: "rgba(245, 158, 11, 0.08)",
  border: "1px solid rgba(245, 158, 11, 0.25)",
  borderRadius: "10px",
  padding: "14px 16px",
};

const warningTitleStyle = {
  margin: "0 0 4px 0",
  fontSize: "12px",
  fontWeight: "600",
  color: "#fbbf24",
  fontFamily: "monospace",
};

const warningTextStyle = {
  margin: "0",
  fontSize: "12px",
  color: "#d1d5db",
  lineHeight: "1.5",
};

const linkStyle = {
  color: "#38bdf8",
  textDecoration: "underline",
};

const footerStyle = {
  padding: "20px 32px",
  borderTop: "1px solid #222222",
  backgroundColor: "#0d0d0d",
};

const footerTextStyle = {
  margin: "0",
  fontSize: "11px",
  color: "#666666",
  fontFamily: "monospace",
  lineHeight: "1.6",
};

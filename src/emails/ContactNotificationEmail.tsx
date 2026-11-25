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
} from "react-email";

export interface ContactNotificationEmailProps {
  cleanName: string;
  cleanEmail: string;
  cleanCompany: string;
  cleanProjectType: string;
  cleanBudget: string;
  cleanTimeline: string;
  cleanDetails: string;
  submissionTimeDhaka: string;
}

export function ContactNotificationEmail({
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
        New Portfolio Enquiry: {cleanProjectType} from {cleanName}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={cardStyle}>
          <Section style={headerStyle}>
            <Text style={eyebrowStyle}>Portfolio Project Enquiry</Text>
            <Heading as="h1" style={titleStyle}>
              {cleanProjectType}
            </Heading>
            <Text style={subtitleStyle}>
              from <strong style={{ color: "#ffffff" }}>{cleanName}</strong>
            </Text>
          </Section>

          <Section style={contentStyle}>
            <Row style={metaRowStyle}>
              <Column style={labelColStyle}>Client Email:</Column>
              <Column style={valueColStyle}>
                <Link href={`mailto:${cleanEmail}`} style={emailLinkStyle}>
                  {cleanEmail}
                </Link>
              </Column>
            </Row>
            <Row style={metaRowStyle}>
              <Column style={labelColStyle}>Company:</Column>
              <Column style={valueColStyle}>{cleanCompany}</Column>
            </Row>
            <Row style={metaRowStyle}>
              <Column style={labelColStyle}>Budget Range:</Column>
              <Column style={valueColStyle}>{cleanBudget}</Column>
            </Row>
            <Row style={metaRowStyle}>
              <Column style={labelColStyle}>Timeline:</Column>
              <Column style={valueColStyle}>{cleanTimeline}</Column>
            </Row>

            <Section style={briefWrapperStyle}>
              <Text style={sectionLabelStyle}>Project Brief &amp; Requirements</Text>
              <Text style={briefBoxStyle}>{cleanDetails}</Text>
            </Section>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>Received: {submissionTimeDhaka}</Text>
            <Text style={{ ...footerTextStyle, marginTop: "4px" }}>
              Reply directly to this notification to email {cleanName}.
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

const eyebrowStyle = {
  margin: "0 0 8px 0",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  color: "#a1a1a1",
  fontFamily: "monospace",
};

const titleStyle = {
  margin: "0",
  fontSize: "22px",
  fontWeight: "600",
  color: "#ffffff",
  lineHeight: "1.3",
};

const subtitleStyle = {
  margin: "6px 0 0 0",
  fontSize: "13px",
  color: "#888888",
};

const contentStyle = {
  padding: "28px 32px",
};

const metaRowStyle = {
  marginBottom: "10px",
};

const labelColStyle = {
  width: "120px",
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

const emailLinkStyle = {
  color: "#38bdf8",
  textDecoration: "none",
};

const briefWrapperStyle = {
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "1px solid #222222",
};

const sectionLabelStyle = {
  margin: "0 0 12px 0",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  color: "#888888",
  fontFamily: "monospace",
};

const briefBoxStyle = {
  margin: "0",
  backgroundColor: "#181818",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  padding: "16px",
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#e5e5e5",
  whiteSpace: "pre-wrap" as const,
  wordBreak: "break-word" as const,
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
};

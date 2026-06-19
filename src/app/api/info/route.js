export async function GET() {
  return Response.json({
    status: "Healthy",
    platform: "Azure Ready",
    framework: "Next.js",
    serverTime: new Date().toISOString(),
    deploymentTips: [
      "Ensure Node.js version is set to 18.x or 20.x in Azure settings.",
      "Set the PORT environment variable if needed, or let Azure App Service manage it.",
      "Use 'next build' and configure the startup command for App Service to: 'node_modules/.bin/next start'.",
      "For Static Web Apps, specify the build output as '.next' or use the default hybrid settings."
    ]
  });
}

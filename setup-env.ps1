# PowerShell script to set up environment variables for Orbit Dashboard
# Run this script before starting the development server

Write-Host "Setting up environment variables for Orbit Dashboard..." -ForegroundColor Green

# Set database URL
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orbit_dashboard"

# Set NextAuth URL
$env:NEXTAUTH_URL="http://localhost:3000"

# Set NextAuth Secret (generate a random one)
$env:NEXTAUTH_SECRET="orbit-dashboard-secret-key-$(Get-Random)"

# Set API URLs
$env:F1_API_BASE_URL="https://ergast.com/api/f1"

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Add your Google OAuth credentials:" -ForegroundColor White
Write-Host "   `$env:GOOGLE_CLIENT_ID=`"your-google-client-id`"" -ForegroundColor Gray
Write-Host "   `$env:GOOGLE_CLIENT_SECRET=`"your-google-client-secret`"" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Add optional API keys:" -ForegroundColor White
Write-Host "   `$env:NEWS_API_KEY=`"your-news-api-key`"" -ForegroundColor Gray
Write-Host "   `$env:OPENAI_API_KEY=`"your-openai-api-key`"" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Your app will be available at: http://localhost:3000" -ForegroundColor Cyan

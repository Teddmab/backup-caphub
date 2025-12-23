# SweetBalance Backend Testing Script
# Interactive script to test Firebase authentication and API endpoints

param(
    [string]$ServerUrl = "http://localhost:3000",
    [string]$FirebaseApiKey = "AIzaSyDFfCb83BZ6-hx-5gEEwZ3KPhOaly6ztIo",
    [string]$Run = "" # Optional: 'login-flow' or 'e2e' to run non-interactively
)

# Color output
$colors = @{
    Success = "Green"
    Error = "Red"
    Info = "Cyan"
    Warning = "Yellow"
    Header = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor $colors.Header
    Write-ColorOutput "  $Title" $colors.Header
    Write-Host ("=" * 60) -ForegroundColor $colors.Header
}

function Test-ServerConnection {
    Write-Header "Testing Server Connection"
    try {
        $response = Invoke-RestMethod -Uri "$ServerUrl/health" -Method Get -ErrorAction Stop
        Write-ColorOutput "[OK] Server is running on $ServerUrl" $colors.Success
        return $true
    } catch {
        Write-ColorOutput "[FAILED] Server is NOT running or not accessible" $colors.Error
        Write-ColorOutput "Error: $($_.Exception.Message)" $colors.Error
        return $false
    }
}

function New-TestUser {
    Write-Header "User Registration"
    
    $timestamp = Get-Random
    $email = "test.$timestamp@example.com"
    $password = "TestPassword123!"
    $username = "testuser$timestamp"
    
    Write-ColorOutput "Registration Details:" $colors.Info
    Write-Host "  Email: $email"
    Write-Host "  Username: $username"
    Write-Host "  Password: [hidden]"
    
    $confirm = Read-Host "`nProceed with registration? (y/n)"
    if ($confirm -ne 'y') {
        Write-ColorOutput "[CANCELLED] Registration cancelled" $colors.Warning
        return $null
    }
    
    try {
        $body = @{
            email = $email
            password = $password
            username = $username
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod `
            -Uri "$ServerUrl/api/v1/auth/register" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        Write-ColorOutput "`n[SUCCESS] Registration successful!" $colors.Success
        Write-Host "User ID: $($response.user.id)"
        Write-Host "Email: $($response.user.email)"
        Write-Host "Firebase UID: $($response.user.firebaseUid)"
        
        return @{
            email = $email
            password = $password
            userId = $response.user.id
            firebaseUid = $response.user.firebaseUid
        }
    } catch {
        Write-ColorOutput "[FAILED] Registration failed: $($_.Exception.Message)" $colors.Error
        return $null
    }
}

# Non-interactive registration (no confirmation prompt)
function New-TestUserAuto {
    Write-Header "User Registration (Auto)"
    
    $timestamp = Get-Random
    $email = "test.$timestamp@example.com"
    $password = "TestPassword123!"
    $username = "testuser$timestamp"
    
    Write-ColorOutput "Registration Details:" $colors.Info
    Write-Host "  Email: $email"
    Write-Host "  Username: $username"
    Write-Host "  Password: [hidden]"

    try {
        $body = @{
            email = $email
            password = $password
            username = $username
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod `
            -Uri "$ServerUrl/api/v1/auth/register" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        Write-ColorOutput "`n[SUCCESS] Registration successful!" $colors.Success
        Write-Host "User ID: $($response.user.id)"
        Write-Host "Email: $($response.user.email)"
        Write-Host "Firebase UID: $($response.user.firebaseUid)"
        
        return @{
            email = $email
            password = $password
            userId = $response.user.id
            firebaseUid = $response.user.firebaseUid
        }
    } catch {
        Write-ColorOutput "[FAILED] Registration failed: $($_.Exception.Message)" $colors.Error
        return $null
    }
}

function Get-FirebaseIdToken {
    param([string]$Email, [string]$Password)
    
    Write-Header "Firebase Login"
    
    try {
        $body = @{
            email = $Email
            password = $Password
            returnSecureToken = $true
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod `
            -Uri "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$FirebaseApiKey" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        Write-ColorOutput "[SUCCESS] Firebase login successful!" $colors.Success
        
        Write-Host "`nToken Information:"
        Write-Host "  Expires In: $($response.expiresIn) seconds"
        Write-Host "  User ID: $($response.localId)"
        Write-Host "  Email: $($response.email)"
        
        Write-Host "`nID Token (first 50 chars):"
        Write-ColorOutput "  $($response.idToken.Substring(0, 50))..." $colors.Info
        
        return $response.idToken
    } catch {
        Write-ColorOutput "[FAILED] Firebase login failed: $($_.Exception.Message)" $colors.Error
        return $null
    }
}

function Test-ProtectedEndpoint {
    param([string]$Token)
    
    if (-not $Token) {
        Write-ColorOutput "[FAILED] No token provided" $colors.Error
        return
    }
    
    Write-Header "Testing Protected Endpoint: /auth/me"
    
    try {
        $response = Invoke-RestMethod `
            -Uri "$ServerUrl/api/v1/auth/me" `
            -Method Get `
            -Headers @{ Authorization = "Bearer $Token" } `
            -ErrorAction Stop
        
        Write-ColorOutput "[SUCCESS] Protected endpoint accessed successfully!" $colors.Success
        Write-Host "`nUser Profile:"
        Write-Host "  ID: $($response.id)"
        Write-Host "  Email: $($response.email)"
        Write-Host "  Username: $($response.username)"
        Write-Host "  Firebase UID: $($response.firebaseUid)"
        Write-Host "  Created: $($response.createdAt)"
    } catch {
        Write-ColorOutput "[FAILED] Protected endpoint failed: $($_.Exception.Message)" $colors.Error
    }
}

function Test-GlucoseAPI {
    param([string]$Token)
    
    if (-not $Token) {
        Write-ColorOutput "[FAILED] No token provided" $colors.Error
        return
    }
    
    Write-Header "Testing API Endpoint: GET /glucose/readings"
    
    try {
        $response = Invoke-RestMethod `
            -Uri "$ServerUrl/api/v1/glucose/readings" `
            -Method Get `
            -Headers @{ Authorization = "Bearer $Token" } `
            -ErrorAction Stop
        
        Write-ColorOutput "[SUCCESS] Glucose API endpoint accessed successfully!" $colors.Success
        Write-Host "`nGlucose Readings: $(($response | Measure-Object).Count) readings"
        
        if ($response.Count -gt 0) {
            Write-Host "`nFirst 3 readings:"
            $response | Select-Object -First 3 | ForEach-Object {
                Write-Host "  - Value: $($_.value) mg/dL | Date: $($_.date)"
            }
        } else {
            Write-ColorOutput "  No readings available" $colors.Warning
        }
    } catch {
        Write-ColorOutput "[FAILED] Glucose API failed: $($_.Exception.Message)" $colors.Error
    }
}

function Test-InvalidToken {
    Write-Header "Testing Invalid Token Rejection"
    
    try {
        $response = Invoke-RestMethod `
            -Uri "$ServerUrl/api/v1/auth/me" `
            -Method Get `
            -Headers @{ Authorization = "Bearer invalid_token_12345" } `
            -ErrorAction Stop
        
        Write-ColorOutput "[WARNING] Invalid token was NOT rejected (unexpected)" $colors.Warning
    } catch {
        if ($_.Exception.Response.StatusCode -eq "Unauthorized" -or $_.Exception.Response.StatusCode -eq 401) {
            Write-ColorOutput "[SUCCESS] Invalid token properly rejected with 401 Unauthorized" $colors.Success
        } else {
            Write-ColorOutput "[WARNING] Token rejected but with unexpected status: $($_.Exception.Response.StatusCode)" $colors.Warning
        }
    }
}

function Test-EndToEnd {
    Write-Header "Full End-to-End Test Flow"
    
    $user = New-TestUser
    if (-not $user) { return }
    
    $token = Get-FirebaseIdToken -Email $user.email -Password $user.password
    if (-not $token) { return }
    
    Test-ProtectedEndpoint -Token $token
    Test-GlucoseAPI -Token $token
    
    Write-Host ""
    Write-ColorOutput "[COMPLETE] Full end-to-end test completed successfully!" $colors.Success
}

# Quick login flow: Register -> Login -> /auth/me (tests 2,3,4)
function Test-LoginFlow {
    Write-Header "Quick Login Flow (2 -> 3 -> 4)"

    $user = New-TestUserAuto
    if (-not $user) { return }

    $token = Get-FirebaseIdToken -Email $user.email -Password $user.password
    if (-not $token) { return }

    Test-ProtectedEndpoint -Token $token

    Write-Host ""
    Write-ColorOutput "[COMPLETE] Login flow tested successfully (2,3,4)" $colors.Success
}

function Show-Menu {
    Write-Host ""
    Write-ColorOutput "=== SweetBalance Backend Testing Menu ===" $colors.Header
    Write-Host ""
    Write-Host "  1. Test Server Connection"
    Write-Host "  2. Register New User"
    Write-Host "  3. Firebase Login (get ID token)"
    Write-Host "  4. Test Protected Endpoint (/auth/me)"
    Write-Host "  5. Test Glucose API Endpoint"
    Write-Host "  6. Test Invalid Token Rejection"
    Write-Host "  7. Run Full End-to-End Test"
    Write-Host "  8. Exit"
    Write-Host "  9. Quick Login Flow (2 → 3 → 4)"
    Write-Host ""
}

function Main {
    Write-ColorOutput "`nSweetBalance Backend Test Suite" $colors.Header
    
    if (-not (Test-ServerConnection)) {
        Write-ColorOutput "`n[WARNING] Cannot proceed without server connection" $colors.Error
        return
    }

    # Non-interactive runs
    if ($Run -eq 'login-flow') {
        Test-LoginFlow
        return
    } elseif ($Run -eq 'e2e') {
        Test-EndToEnd
        return
    }
    
    $storedToken = $null
    $storedUser = $null
    
    while ($true) {
        Show-Menu
        $choice = Read-Host "Select option (1-9)"
        
        switch ($choice) {
            "1" {
                Test-ServerConnection
            }
            "2" {
                $storedUser = New-TestUser
                if ($storedUser) {
                    Write-ColorOutput "`n[INFO] User credentials stored for next steps" $colors.Info
                }
            }
            "3" {
                if (-not $storedUser) {
                    Write-ColorOutput "[FAILED] No user credentials available. Register a user first (option 2)" $colors.Error
                } else {
                    $storedToken = Get-FirebaseIdToken -Email $storedUser.email -Password $storedUser.password
                    if ($storedToken) {
                        Write-ColorOutput "`n[INFO] Token stored for next steps" $colors.Info
                    }
                }
            }
            "4" {
                if (-not $storedToken) {
                    Write-ColorOutput "[FAILED] No token available. Login first (option 3)" $colors.Error
                } else {
                    Test-ProtectedEndpoint -Token $storedToken
                }
            }
            "5" {
                if (-not $storedToken) {
                    Write-ColorOutput "[FAILED] No token available. Login first (option 3)" $colors.Error
                } else {
                    Test-GlucoseAPI -Token $storedToken
                }
            }
            "6" {
                Test-InvalidToken
            }
            "7" {
                Test-EndToEnd
            }
            "8" {
                Write-ColorOutput "`nGoodbye!" $colors.Success
                exit
            }
            "9" {
                Test-LoginFlow
            }
            default {
                Write-ColorOutput "[FAILED] Invalid option. Please select 1-9" $colors.Error
            }
        }
    }
}

Main

# Supabase Email Templates for UlamApp

These are custom email templates designed to match UlamApp's branding. Copy and paste these into your Supabase dashboard under **Authentication > Email Templates**.

## 🎨 Design Features
- **Brand Colors**: Orange (#f97316) and Red (#ef4444) gradient
- **Modern Design**: Rounded corners, clean layout, mobile-responsive
- **Chef Hat Icon**: Branded logo representation
- **Professional**: Matches your app's aesthetic

---

## 📧 1. Confirm Signup Email Template

**Subject:** `Confirm your UlamApp account`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Gradient Top Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(to right, #f97316, #ef4444, #9333ea);"></td>
          </tr>
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px;">
              <!-- Logo Icon -->
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f97316, #ef4444); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                <span style="font-size: 32px;">👨‍🍳</span>
              </div>
              
              <!-- Brand Name -->
              <h1 style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #0f172a; line-height: 1.2;">
                UlamApp
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">
                Your AI kitchen companion
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #0f172a; line-height: 1.3;">
                Welcome to UlamApp! 👋
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                Thanks for signing up! We're excited to help you discover amazing Filipino recipes based on what's in your pantry.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
                Please confirm your email address by clicking the button below to activate your account:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); transition: all 0.2s;">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #64748b;">
                Or copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #f97316; text-decoration: underline; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
              
              <!-- Security Note -->
              <div style="padding: 16px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;">
                  <strong>🔒 Security Note:</strong> This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #64748b; text-align: center;">
                Happy cooking! 🍳
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                © 2024 UlamApp. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom Spacing -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                This email was sent by UlamApp. If you have any questions, please contact our support team.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🔐 2. Magic Link Email Template

**Subject:** `Sign in to UlamApp`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In to UlamApp</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Gradient Top Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(to right, #f97316, #ef4444, #9333ea);"></td>
          </tr>
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px;">
              <!-- Logo Icon -->
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f97316, #ef4444); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                <span style="font-size: 32px;">👨‍🍳</span>
              </div>
              
              <!-- Brand Name -->
              <h1 style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #0f172a; line-height: 1.2;">
                UlamApp
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">
                Your AI kitchen companion
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #0f172a; line-height: 1.3;">
                Sign In Request 🔑
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                You requested a magic link to sign in to your UlamApp account. Click the button below to securely sign in:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); transition: all 0.2s;">
                      Sign In to UlamApp
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #64748b;">
                Or copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #f97316; text-decoration: underline; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
              
              <!-- Security Note -->
              <div style="padding: 16px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;">
                  <strong>🔒 Security Note:</strong> This link will expire in 1 hour. If you didn't request this sign-in link, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #64748b; text-align: center;">
                Happy cooking! 🍳
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                © 2024 UlamApp. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom Spacing -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                This email was sent by UlamApp. If you have any questions, please contact our support team.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🔄 3. Change Email Address Template

**Subject:** `Confirm your new email address`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm New Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Gradient Top Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(to right, #f97316, #ef4444, #9333ea);"></td>
          </tr>
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px;">
              <!-- Logo Icon -->
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f97316, #ef4444); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                <span style="font-size: 32px;">👨‍🍳</span>
              </div>
              
              <!-- Brand Name -->
              <h1 style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #0f172a; line-height: 1.2;">
                UlamApp
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">
                Your AI kitchen companion
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #0f172a; line-height: 1.3;">
                Confirm Your New Email 📧
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                You requested to change your email address for your UlamApp account. Click the button below to confirm your new email:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); transition: all 0.2s;">
                      Confirm New Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #64748b;">
                Or copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #f97316; text-decoration: underline; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
              
              <!-- Security Note -->
              <div style="padding: 16px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;">
                  <strong>🔒 Security Note:</strong> This link will expire in 24 hours. If you didn't request this change, please contact our support team immediately.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #64748b; text-align: center;">
                Happy cooking! 🍳
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                © 2024 UlamApp. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🔑 4. Reset Password Email Template

**Subject:** `Reset your UlamApp password`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Gradient Top Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(to right, #f97316, #ef4444, #9333ea);"></td>
          </tr>
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px;">
              <!-- Logo Icon -->
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f97316, #ef4444); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                <span style="font-size: 32px;">👨‍🍳</span>
              </div>
              
              <!-- Brand Name -->
              <h1 style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 32px; font-weight: bold; color: #0f172a; line-height: 1.2;">
                UlamApp
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">
                Your AI kitchen companion
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #0f172a; line-height: 1.3;">
                Reset Your Password 🔐
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                We received a request to reset the password for your UlamApp account. Click the button below to create a new password:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); transition: all 0.2s;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #64748b;">
                Or copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #f97316; text-decoration: underline; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
              
              <!-- Security Note -->
              <div style="padding: 16px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;">
                  <strong>🔒 Security Note:</strong> This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
              </div>
              
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                <strong>Tip:</strong> Choose a strong password that you haven't used before. A good password should be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #64748b; text-align: center;">
                Happy cooking! 🍳
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                © 2024 UlamApp. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom Spacing -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                This email was sent by UlamApp. If you have any questions, please contact our support team.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 📝 How to Use These Templates

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **Authentication** → **Email Templates**

2. **Select Template Type**
   - Choose the template you want to customize (e.g., "Confirm signup")

3. **Copy & Paste**
   - Copy the HTML from the template above
   - Paste it into the **Body** field
   - Update the **Subject** field with the provided subject line

4. **Test**
   - Send a test email to verify the template looks correct
   - Check on both desktop and mobile email clients

5. **Save**
   - Click **Save** to apply the changes

---

## 🎯 Available Variables

Supabase provides these variables you can use in templates:

- `{{ .ConfirmationURL }}` - The confirmation/reset link
- `{{ .Token }}` - The token (if needed)
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address
- `{{ .RedirectTo }}` - Redirect URL after confirmation

---

## 📱 Email Client Compatibility

These templates are designed to work across:
- ✅ Gmail (Desktop & Mobile)
- ✅ Outlook (Desktop & Mobile)
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Most modern email clients

---

## 🎨 Customization Tips

- **Colors**: Change `#f97316` (orange) and `#ef4444` (red) to match your brand
- **Logo**: Replace the emoji 👨‍🍳 with your actual logo image URL
- **Fonts**: The templates use system fonts for maximum compatibility
- **Spacing**: Adjust padding values to match your preferences

---

## ⚠️ Important Notes

- Always test emails before going live
- Keep the `{{ .ConfirmationURL }}` variable - it's required for functionality
- The templates use inline styles for maximum email client compatibility
- Some email clients strip out certain CSS, so keep styles simple


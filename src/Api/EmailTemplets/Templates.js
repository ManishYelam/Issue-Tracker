module.exports = {
  LaunchCodeTemplate: (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
            text-align: center;
        }
        .header {
            padding: 20px;
        }
        .logo-container {
            width: 80px;
            height: 80px;
            margin: 0 auto;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #007bff;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .logo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .header h2 {
            font-size: 24px;
            margin: 10px 0;
            color: #007bff;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #555;
        }
        .content p {
            margin-bottom: 15px;
        }
        .code {
            font-size: 28px;
            font-weight: bold;
            background-color: #f1f1f1;
            padding: 10px 20px;
            color: #007bff;
            border-radius: 4px;
            display: inline-block;
            letter-spacing: 2px;
            margin: 20px 0;
        }
        .btn {
            background-color: #28a745;
            color: white;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-top: 15px;
        }
        .btn-manual {
            background-color: #007bff;
            color: white;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-top: 10px;
        }
        .warning {
            color: #d9534f;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            font-size: 12px;
            color: #888;
            padding: 20px 0;
            border-top: 1px solid #eee;
        }
        @media (max-width: 600px) {
            .container {
                width: 95%;
                margin: 20px auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="https://res.cloudinary.com/dhbkxhxsy/image/upload/v1735644524/fkw33za6df1tejmc9zxy.jpg" alt="Company Logo">
            </div>
            <h2>Welcome to ${data.appName}!</h2>
        </div>
        <div class="content">
            <p>To complete your registration, please enter the code below:</p>
            <div class="code">${data.launchCode}</div>

            <p>To verify your email, click the button below:</p>
            
            <a href="${data.verificationUrl}" class="btn">Verify Email</a>

            <p><strong>OR</strong></p>

            <p>Enter your OTP manually by clicking below:</p>
            <a href="http://localhost:5173/verify?userId=${data.userId}" class="btn-manual">Enter OTP Manually</a>

            <p><b>Note:</b> This OTP is valid for <strong>1 hour</strong>. If you do not verify your email within 1 hour, your account will be deleted automatically.</p>

            <p>If you didn’t request this, you can ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
            <p>${data.companyName}, 123 Medical St, Health City, HC 12345</p>
            <p>Support Email: ${data.supportEmail}</p>
            <p>Contact: ${data.contactNumber}</p>
        </div>
    </div>
</body>
</html>
`,

  verificationTemplate: (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified Successfully</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
            text-align: center;
        }
        .header {
            background-color: #28a745;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .logo-container {
            width: 80px;
            height: 80px;
            margin: 10px auto;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
        }
        .logo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #555;
            font-size: 16px;
        }
        .credentials-container {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px auto;
            text-align: left;
            font-size: 16px;
            font-weight: bold;
            border: 1px solid #ddd;
            max-width: 400px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        }
        .credentials-container p {
            margin: 5px 0;
            color: #333;
        }
        .credentials-container span {
            display: block;
            color: #007bff;
            font-size: 18px;
            font-weight: bold;
        }
        .btn {
            background-color: #007bff;
            color: white;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-top: 15px;
        }
        .btn-reset {
            background-color: #ff9800;
            color: white;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-top: 10px;
        }
        .footer {
            font-size: 12px;
            color: #888;
            padding: 20px 0;
            border-top: 1px solid #eee;
        }
        @media (max-width: 600px) {
            .container {
                width: 95%;
                margin: 20px auto;
            }
            .credentials-container {
                max-width: 100%;
                padding: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div class="logo-container">
                <img src="https://res.cloudinary.com/dhbkxhxsy/image/upload/v1735644524/fkw33za6df1tejmc9zxy.jpg" alt="Company Logo">
            </div>
            <h2>Welcome to ${data.appName}!</h2>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2 style="color: #28a745;">✅ Email Verification Successful</h2>
            <p>Hi <strong>${data.userName}</strong>,</p>
            <p>Your email has been successfully verified! You can now log in using the credentials below:</p>

            <!-- Credentials Box -->
            <div class="credentials-container">
                <p>Email: <span>${data.userEmail}</span></p>
                <p>Password: <span>${data.password}</span></p>
            </div>

            <p>You can now log in to your account:</p>
            <a href="http://localhost:5173/login" class="btn">Login Now</a>

            <p><strong>OR</strong></p>

            <p>For security reasons, we highly recommend updating your password immediately.</p>
            <a href="${data.resetPasswordUrl}" class="btn-reset">Reset Password</a>

            <p>If you didn’t request this, you can ignore this email.</p>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
            <p>${data.companyName}, 123 Medical St, Health City, HC 12345</p>
            <p>Support Email: ${data.supportEmail}</p>
            <p>Contact: ${data.contactNumber}</p>
        </div>
    </div>
</body>
</html>
`,

  registrationTemplate: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Universal styles */
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                border: 1px solid #ddd;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 15px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .header h2 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                color: #555;
                font-size: 16px;
            }
            .content p {
                margin-bottom: 20px;
            }
            .details {
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f2f2f2;
            }
            .cta-button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 12px 20px;
                font-size: 16px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
                transition: background-color 0.3s ease;
            }
            .cta-button:hover {
                background-color: #45a049;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888;
                padding: 20px 0;
                border-top: 1px solid #eee;
            }
            /* Responsive styles */
            @media (max-width: 600px) {
                .container {
                    width: 95%;
                    margin: 20px auto;
                }
                .content {
                    padding: 10px;
                }
            }
            /* Hidden preheader for inbox preview */
            .preheader {
                display: none;
                visibility: hidden;
                opacity: 0;
                color: transparent;
                height: 0;
                width: 0;
            }
        </style>
    </head>
    <body>
        <span class="preheader">Verify your email for [Your App Name], ${data.userName}.</span>
        <div class="container">
            <div class="header">
                <h2>Welcome to [Your App Name]</h2>
            </div>
            <div class="content">
                <p>Hi ${data.userName},</p>
                <p>Thank you for registering with us at [Your App Name]. Please review your registration details:</p>
                <div class="details">
                    <p><strong>Email:</strong> ${data.userEmail}</p>
                    <p><strong>Phone Number:</strong> ${data.userPhone}</p>
                    <p><strong>PAN Number:</strong> ${data.userPAN}</p>
                    <p><strong>Aadhar Number:</strong> ${data.userAadhar}</p>
                    <p><strong>Address:</strong> ${data.userAddress}</p>
                </div>
                <p>To complete your registration, please verify your email address by clicking the button below:</p>
                <a href="${data.verificationLink}" class="cta-button" target="_blank">Verify Email</a>
                <p>If you did not create this account, no further action is required. Feel free to reach out if you have any questions.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`,

  otpTemplate: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          /* Your existing styles */
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>Your OTP Code</h2>
          </div>
          <div class="content">
              <p>Hi ${data.userName},</p>
              <p>Your OTP code is: <strong>${data.otp}</strong></p>
              <p>This code is valid for a limited time. If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  sendResetPasswordTemplate: (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Universal Styles */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
        }
        .header {
            text-align: center;
            padding: 20px;
        }
        .header img {
            width: 50px;
        }
        .header h2 {
            font-size: 24px;
            margin: 10px 0;
            color: #dc3545;
        }
        .content {
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #555;
        }
        .content p {
            margin-bottom: 15px;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            background-color: #f1f1f1;
            padding: 10px 20px;
            color: #dc3545;
            border-radius: 4px;
            display: inline-block;
            letter-spacing: 2px;
            margin: 20px 0;
        }
        .btn {
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            padding: 20px 0;
            border-top: 1px solid #eee;
        }
        /* Responsive Styles */
        @media (max-width: 600px) {
            .container {
                width: 95%;
                margin: 20px auto;
            }
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/dhbkxhxsy/image/upload/v1735644524/fkw33za6df1tejmc9zxy.jpg" alt="Service Logo">
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Hello ${data.userName},</p>
            <p>You recently requested to reset your password. Use the code below to complete the process:</p>
            <div class="code">${data.launchCode}</div>
            <a href="${data.resetLink}" class="btn">Reset Password</a>
            <p>If you didn’t request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Service Name. All rights reserved.</p>
            <p>Your Service Name, 123 Service St, City, Country</p>
        </div>
    </div>
</body>
</html>
`,

  passwordChangeTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          /* Universal Styles */
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
              color: #333;
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
          }
          .header h2 {
              margin: 0;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 20px;
              font-size: 16px;
              color: #555;
              line-height: 1.5;
          }
          .content p {
              margin-bottom: 15px;
          }
          .alert {
              color: #d9534f;
              font-weight: bold;
              background-color: #ffeef0;
              padding: 10px;
              border-left: 4px solid #d9534f;
              border-radius: 4px;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: #888;
              padding: 20px 0;
              border-top: 1px solid #eee;
          }
          /* Responsive Styles */
          @media (max-width: 600px) {
              .container {
                  width: 95%;
                  margin: 20px auto;
              }
              .content {
                  padding: 15px;
              }
          }
          /* Hidden Preheader */
          .preheader {
              display: none;
              visibility: hidden;
              opacity: 0;
              color: transparent;
              height: 0;
              width: 0;
          }
      </style>
  </head>
  <body>
      <span class="preheader">Your password has been changed, ${data.userName}. If this wasn't you, please take action immediately.</span>
      <div class="container">
          <div class="header">
              <h2>Password Changed Successfully</h2>
          </div>
          <div class="content">
              <p>Hi ${data.userName},</p>
              <p>Your password has been successfully updated. If you initiated this request, no further action is required.</p>
              <div class="alert">
                  If you did not make this change, please contact our support team immediately to secure your account.
              </div>
              <p><strong>User ID:</strong> ${data.userId}</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  documentUploadTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          :root {
              --primary-color: #4CAF50;
              --secondary-color: #f7f7f7;
              --text-color: #333;
              --footer-color: #888;
              --border-color: #ddd;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: var(--secondary-color);
              margin: 0;
              padding: 20px;
              color: var(--text-color);
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          h2 {
              color: var(--primary-color);
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
          }
          p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
          }
          a {
              color: var(--primary-color);
              text-decoration: none;
              font-weight: bold;
          }
          a:hover {
              text-decoration: underline;
          }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: var(--primary-color);
              color: white;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
          }
          .button:hover {
              background-color: #388E3C;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid var(--border-color);
              margin-top: 40px;
          }
          @media screen and (max-width: 600px) {
              .container {
                  padding: 10px;
              }
              h2 {
                  font-size: 20px;
              }
              p {
                  font-size: 14px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Document Upload Request</h2>
          <p>Hi ${data.userName},</p>
          <p>We request you to upload your files (${data.documentTypes}) via the link below.</p>
          <p><strong>Accepted formats:</strong> ${data.documentTypes}</p>
          <a href="${data.uploadLink}" class="button">Upload Your Documents</a>
          <p>If you have any questions, feel free to reach out.</p>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  sendResetEmail: (data) => {
    const resetLink = `http://13.127.13.10:5000/reset-password?token=${data.token}`;
    const resetEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f8fa;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header img {
            width: 40px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 24px;
            color: #333;
            margin: 0;
        }
        .content p {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
            margin: 0 0 15px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            color: #fff;
            background-color: #28a745;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            font-size: 12px;
            color: #888;
            margin-top: 20px;
        }
        .footer a {
            color: #0366d6;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo">
            <h1>Reset your GitHub password</h1>
        </div>
        <div class="content">
            <h2>GitHub password reset</h2>
            <p>We heard that you lost your GitHub password. Sorry about that!</p>
            <p>But don’t worry! You can use the following button to reset your password:</p>
            <a href="{{reset_link}}" class="button">Reset your password</a>
            <p>If you don’t use this link within 3 hours, it will expire. <a href="{{new_link}}">Click here to get a new password reset link.</a></p>
        </div>
        <div class="footer">
            <p>Thanks,<br>The GitHub Team</p>
        </div>
    </div>
</body>
</html>
`;
  },

  performanceTrackingTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          /* CSS Variables for easy customization */
          :root {
              --primary-color: #4CAF50;
              --header-bg: #f4f4f4;
              --footer-color: #888;
              --border-color: #ddd;
              --text-color: #333;
              --highlight-color: #f9f9f9;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
              color: var(--text-color);
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          .header {
              background-color: var(--header-bg);
              color: var(--primary-color);
              padding: 15px;
              text-align: center;
              border-radius: 8px 8px 0 0;
          }
          .header h2 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              font-size: 16px;
              color: var(--text-color);
          }
          .content p {
              margin-bottom: 20px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
          }
          th, td {
              border: 1px solid var(--border-color);
              padding: 10px;
              text-align: left;
          }
          th {
              background-color: var(--primary-color);
              color: white;
          }
          tr:nth-child(even) {
              background-color: var(--highlight-color);
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid #eee;
          }
          /* Responsive Styles */
          @media (max-width: 600px) {
              .container {
                  width: 95%;
                  margin: 20px auto;
              }
              .content {
                  padding: 10px;
              }
          }
          /* Hidden Preheader */
          .preheader {
              display: none;
              visibility: hidden;
              opacity: 0;
              color: transparent;
              height: 0;
              width: 0;
          }
      </style>
  </head>
  <body>
      <span class="preheader">Your performance tracking report is ready for review.</span>
      <div class="container">
          <div class="header">
              <h2>Performance Tracking Report</h2>
          </div>
          <div class="content">
              <p>Hi [Recipient's Name],</p>
              <p>Here is the performance report for [Date/Period]:</p>
              <table>
                  <tr>
                      <th>Action</th>
                      <th>Duration</th>
                  </tr>
                  ${data
                    .map(
                      (item) => `
                  <tr>
                      <td>${item.Action}</td>
                      <td>${item.Duration}</td>
                  </tr>`
                    )
                    .join('')}
              </table>
              <p>If you have any questions about this report, please contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  systemLogsTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          /* CSS Variables for easy customization */
          :root {
              --primary-color: #4CAF50;
              --header-bg: #f4f4f4;
              --footer-color: #888;
              --border-color: #ddd;
              --text-color: #333;
              --highlight-color: #f9f9f9;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
              color: var(--text-color);
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          .header {
              background-color: var(--header-bg);
              color: var(--primary-color);
              padding: 15px;
              text-align: center;
              border-radius: 8px 8px 0 0;
          }
          .header h2 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              font-size: 16px;
              color: var(--text-color);
          }
          .content p {
              margin-bottom: 20px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
          }
          th, td {
              border: 1px solid var(--border-color);
              padding: 10px;
              text-align: left;
          }
          th {
              background-color: var(--primary-color);
              color: white;
          }
          tr:nth-child(even) {
              background-color: var(--highlight-color);
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid #eee;
          }
          /* Responsive Styles */
          @media (max-width: 600px) {
              .container {
                  width: 95%;
                  margin: 20px auto;
              }
              .content {
                  padding: 10px;
              }
          }
          /* Hidden Preheader */
          .preheader {
              display: none;
              visibility: hidden;
              opacity: 0;
              color: transparent;
              height: 0;
              width: 0;
          }
      </style>
  </head>
  <body>
      <span class="preheader">Your system logs report is ready for review.</span>
      <div class="container">
          <div class="header">
              <h2>System Logs Report</h2>
          </div>
          <div class="content">
              <p>Hi [Recipient's Name],</p>
              <p>Here are the system logs for [Date/Period]:</p>
              <table>
                  <tr>
                      <th>Timestamp</th>
                      <th>Log Level</th>
                      <th>Message</th>
                  </tr>
                  ${data
                    .map(
                      (log) => `
                  <tr>
                      <td>${log.timestamp}</td>
                      <td>${log.level}</td>
                      <td>${log.message}</td>
                  </tr>`
                    )
                    .join('')}
              </table>
              <p>For any questions or further details, please reach out to support.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  notificationTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          /* CSS Variables for easy customization */
          :root {
              --primary-color: #4CAF50;
              --header-bg: #f4f4f4;
              --footer-color: #888;
              --border-color: #ddd;
              --text-color: #333;
              --highlight-color: #f9f9f9;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
              color: var(--text-color);
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          .header {
              background-color: var(--header-bg);
              color: var(--primary-color);
              padding: 15px;
              text-align: center;
              border-radius: 8px 8px 0 0;
          }
          .header h2 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              font-size: 16px;
              color: var(--text-color);
          }
          .content p {
              margin-bottom: 20px;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid #eee;
          }
          /* Responsive Styles */
          @media (max-width: 600px) {
              .container {
                  width: 95%;
                  margin: 20px auto;
              }
              .content {
                  padding: 10px;
              }
          }
          /* Hidden Preheader */
          .preheader {
              display: none;
              visibility: hidden;
              opacity: 0;
              color: transparent;
              height: 0;
              width: 0;
          }
      </style>
  </head>
  <body>
      <span class="preheader">You have a new notification from [Your App Name].</span>
      <div class="container">
          <div class="header">
              <h2>${data.title}</h2>
          </div>
          <div class="content">
              <p>Hi [Recipient's Name],</p>
              <p>${data.content}</p>
              <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  welcomeTemplate: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          /* Universal styles */
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              text-align: center;
              padding: 20px;
              border-radius: 10px 10px 0 0;
          }
          .content {
              padding: 20px;
              font-size: 16px;
              color: #555;
          }
          .content p {
              margin: 1em 0;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: #888;
              margin-top: 20px;
              padding: 10px 0;
              border-top: 1px solid #eee;
          }
          .cta-button {
              display: inline-block;
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              text-align: center;
              text-decoration: none;
              font-size: 16px;
              margin-top: 20px;
              border-radius: 5px;
          }
          .cta-button:hover {
              background-color: #45a049;
          }
          /* Responsive styles */
          @media (max-width: 600px) {
              .container {
                  width: 95%;
              }
              .content {
                  padding: 10px;
              }
          }
          /* Hidden preview text for inbox summary */
          .preheader {
              display: none;
              visibility: hidden;
              opacity: 0;
              color: transparent;
              height: 0;
              width: 0;
          }
      </style>
  </head>
  <body>
      <span class="preheader">Welcome to [Your App Name], ${data.name}! We are thrilled to have you with us.</span>
      <div class="container">
          <div class="header">
              <h2>Welcome to [Your App Name]!</h2>
          </div>
          <div class="content">
              <p>Hi ${data.name},</p>
              <p>We are thrilled to have you join our community! At [Your App Name], we are committed to providing you with the best experience possible.</p>
              <p>You can start exploring right away and make the most of our services.</p>
              <p>To get started, click the button below:</p>
              <a href="[Your App URL]" class="cta-button">Get Started</a>
              <p>If you have any questions, feel free to reach out to our support team. We're here to help!</p>
              <p>Best regards,<br/>The [Your App Name] Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  eventInvitationTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          :root {
              --primary-color: #3F51B5;
              --header-bg: #f4f4f4;
              --footer-color: #888;
              --border-color: #ddd;
              --text-color: #333;
              --link-color: #1E88E5;
              --button-bg: #3F51B5;
              --button-color: #fff;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
              color: var(--text-color);
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          .header {
              background-color: var(--header-bg);
              color: var(--primary-color);
              padding: 15px;
              text-align: center;
              border-radius: 8px 8px 0 0;
          }
          .content {
              padding: 20px;
          }
          .content p {
              margin: 10px 0;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid #eee;
          }
          .cta-button {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: var(--button-bg);
              color: var(--button-color);
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .cta-button:hover {
              background-color: darken(var(--button-bg), 10%);
          }
          @media (max-width: 600px) {
              .container {
                  padding: 15px;
              }
              .header h2 {
                  font-size: 1.5em;
              }
              .cta-button {
                  padding: 8px 15px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>You're Invited to ${data.eventName}</h2>
          </div>
          <div class="content">
              <p>Hi [Recipient's Name],</p>
              <p>We are excited to invite you to our upcoming event:</p>
              <p><strong>Date:</strong> ${data.eventDate}</p>
              <p><strong>Join us here:</strong> <a href="${data.eventLink}" target="_blank" style="color: var(--link-color); text-decoration: underline;">${data.eventLink}</a></p>
              <p>We hope to see you there!</p>
              <a href="${data.eventLink}" class="cta-button" target="_blank">RSVP Now</a>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  downloadProjectTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          :root {
              --primary-color: #3F51B5;
              --button-color: #4CAF50;
              --secondary-color: #f7f7f7;
              --text-color: #333;
              --footer-color: #888;
              --border-color: #ddd;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: var(--secondary-color);
              margin: 0;
              padding: 20px;
              color: var(--text-color);
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          h2 {
              color: var(--primary-color);
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
          }
          p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
          }
          .download-btn {
              display: block;
              width: 100%;
              text-align: center;
              background-color: var(--button-color);
              color: white;
              padding: 12px 0;
              font-size: 16px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              transition: background-color 0.3s;
          }
          .download-btn:hover {
              background-color: #388E3C;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid var(--border-color);
              margin-top: 40px;
          }
          @media screen and (max-width: 600px) {
              .container {
                  padding: 10px;
              }
              h2 {
                  font-size: 20px;
              }
              p {
                  font-size: 14px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Hi ${data.userName},</h2>
          <p>Your project "<strong>${data.projectName}</strong>" is now ready for download! Click the button below to download your project files.</p>
          <a href="${data.downloadLink}" class="download-btn">Download Project</a>
          <p>If you encounter any issues with the download, feel free to reach out to our support team for assistance.</p>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  eventCancellationTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          :root {
              --primary-color: #D32F2F;
              --secondary-color: #f7f7f7;
              --text-color: #333;
              --footer-color: #888;
              --border-color: #ddd;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: var(--secondary-color);
              margin: 0;
              padding: 20px;
              color: var(--text-color);
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          h2 {
              color: var(--primary-color);
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
          }
          p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
              text-align: center;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid var(--border-color);
              margin-top: 40px;
          }
          @media screen and (max-width: 600px) {
              .container {
                  padding: 10px;
              }
              h2 {
                  font-size: 20px;
              }
              p {
                  font-size: 14px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Important Notice: Cancellation of ${data.eventName}</h2>
          <p>We regret to inform you that due to unforeseen circumstances, the event "<strong>${data.eventName}</strong>" has been cancelled.</p>
          <p>We sincerely apologize for any inconvenience this may cause. If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your App Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  termsAndConditionsTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          :root {
              --primary-color: #3F51B5;
              --secondary-color: #f7f7f7;
              --text-color: #333;
              --footer-color: #888;
              --border-color: #ddd;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: var(--secondary-color);
              margin: 0;
              padding: 20px;
              color: var(--text-color);
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          h2 {
              color: var(--primary-color);
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
          }
          p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
          }
          a {
              color: var(--primary-color);
              text-decoration: none;
              font-weight: bold;
          }
          a:hover {
              text-decoration: underline;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid var(--border-color);
              margin-top: 40px;
          }
          @media screen and (max-width: 600px) {
              .container {
                  padding: 10px;
              }
              h2 {
                  font-size: 20px;
              }
              p {
                  font-size: 14px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Terms and Conditions Update</h2>
          <p>Dear ${data.userName},</p>
          <p>We have updated our Terms and Conditions at ${data.companyName}. Please take a moment to review the new terms by clicking the link below:</p>
          <p><a href="${data.termsLink}" target="_blank">Read Terms and Conditions</a></p>
          <p>By continuing to use our services, you agree to the updated terms.</p>
          <p>If you have any questions or concerns, feel free to contact us for clarification.</p>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

  sendLocationTemplate: (data) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          :root {
              --primary-color: #3F51B5;
              --secondary-color: #f7f7f7;
              --text-color: #333;
              --footer-color: #888;
              --border-color: #ddd;
          }
          body {
              font-family: Arial, sans-serif;
              background-color: var(--secondary-color);
              margin: 0;
              padding: 20px;
              color: var(--text-color);
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border-color);
          }
          h2 {
              color: var(--primary-color);
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
          }
          p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
          }
          a {
              color: var(--primary-color);
              text-decoration: none;
              font-weight: bold;
          }
          a:hover {
              text-decoration: underline;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: var(--footer-color);
              padding: 20px 0;
              border-top: 1px solid var(--border-color);
              margin-top: 40px;
          }
          @media screen and (max-width: 600px) {
              .container {
                  padding: 10px;
              }
              h2 {
                  font-size: 20px;
              }
              p {
                  font-size: 14px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>${data.locationName}</h2>
          <p>Hi ${data.userName},</p>
          <p>We are pleased to share the location details for the upcoming event/meeting at ${data.locationName}.</p>
          <p><strong>Address:</strong> ${data.locationAddress}</p>
          <p><strong>Find us on the map:</strong> <a href="${data.locationLink}" target="_blank">View Location</a></p>
          <p>We look forward to seeing you there!</p>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,
};

const baseEmailTemplate = (title, name, message, buttonText, buttonLink) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                text-align: center;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                width: 90%;
                max-width: 600px;
                margin: 0 auto;
            }
            h2 {
                color: #333333;
            }
            p {
                color: #555555;
            }
            .btn {
                display: inline-block;
                background-color: #007bff;
                color: #ffffff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                font-weight: bold;
            }
            .btn:hover {
                background-color: #0056b3;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>${title}</h2>
            <p>Halo <strong>${name}</strong>,</p>
            <p>${message}</p>
            <a href="${buttonLink}" class="btn">${buttonText}</a>
            <p class="footer">© ${new Date().getFullYear()} Cakrapedia. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;
};

export const emailVerifyTemplate = (name, verificationLink) => {
    return baseEmailTemplate(
        "Verifikasi Email Anda",
        name,
        "Terima kasih telah mendaftar. Klik tombol di bawah ini untuk memverifikasi email Anda:",
        "Verifikasi Email",
        verificationLink
    );
};

export const emailForgotPasswordTemplate = (name, resetLink) => {
    return baseEmailTemplate(
        "Reset Password",
        name,
        "Klik tombol di bawah ini untuk mereset password Anda. Link ini hanya berlaku selama 1 jam.",
        "Reset Password",
        resetLink
    );
};
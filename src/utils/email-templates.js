export const generateEmailTemplate = ({ otpCode }) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #4a90e2; text-align: center;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800; color: white;">Todos</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">                
                <p style="font-size: 16px; margin-bottom: 25px;">Hello,</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">Thank you for using Todos! Use the following One Time Password (otp) to complete your registration:</p>
                
                <h1 style="background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; color: #333;">
                    ${otpCode}
                </h1>

                <p style="font-size: 16px; margin-top: 25px;">This OTP is valid for the next 15 minutes. Please do not share it with anyone.</p>



            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
               
                <p style="margin: 0;">
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</div>
`;

export const emailTemplates = [
  {
    label: "OTP Email",
    generateSubject: () => `Your OTP Code for Todos App Registration`,
    generateBody: (data) => generateEmailTemplate({ otpCode: data.otpCode, email: data.email }),
  },
];

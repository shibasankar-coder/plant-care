/**
 * Generates an ultra-attractive, responsive HTML email template for plant care reminders.
 */
const getCareReportTemplate = (userName, tasks, frontendUrl) => {
    const totalTasks = tasks.water.length + tasks.fertilize.length + tasks.repot.length;
    const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plant Care Update</title>
</head>
<body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a202c; margin: 0; padding: 0; background-color: #004F3B;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #004F3B; padding: 60px 0;">
        <tr>
            <td align="center" valign="middle">
                <!-- Center Wrapper -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #fcfefc; border-radius: 48px; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.4);">

                    
                    <!-- Sophisticated Dual-Green Header -->
                    <tr>
                        <td align="center" style="background-color: #009966; padding: 70px 40px; border-bottom: 6px solid #fbbf24;">
                            <div style="background: #fbbf24; color: #004F3B; display: inline-block; padding: 6px 16px; border-radius: 50px; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 20px;">Daily Digest</div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 40px; font-weight: 900; letter-spacing: -0.05em; line-height: 1;">Your Jungle Update 🌿</h1>
                            <p style="color: #00291fff; margin: 15px 0 0 0; font-size: 18px; font-weight: 500; opacity: 0.9;">${dateStr}</p>
                        </td>
                    </tr>


                    <!-- Body Content -->
                    <tr>
                        <td align="center" style="padding: 60px 50px;">
                            <div style="text-align: center; margin-bottom: 50px;">
                                <h2 style="font-size: 28px; color: #004F3B; margin: 0 0 20px 0; font-weight: 800;">Hello ${userName}!</h2>
                                <p style="font-size: 18px; color: #4a5568; margin: 0 auto; max-width: 450px;">Your plants have been hard at work growing. Here's what they need today:</p>
                            </div>

                            <!-- Left-Aligned Task Sections -->
                            <div style="max-width: 480px; margin: 0 auto;">
                                ${tasks.water.length > 0 ? `
                                <div style="margin-bottom: 40px; text-align: left;">
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <span style="font-size: 28px; margin-right: 12px;">💦</span>
                                        <h3 style="color: #2563eb; margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900;">Needs Water</h3>
                                    </div>
                                    <ul style="list-style-type: none; padding: 0 0 0 40px; margin: 0; color: #1e40af; font-weight: 600; font-size: 17px; line-height: 1.8;">
                                        ${tasks.water.map(p => `<li>• ${p}</li>`).join('')}
                                    </ul>
                                </div>
                                ` : ''}

                                ${tasks.fertilize.length > 0 ? `
                                <div style="margin-bottom: 40px; text-align: left;">
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <span style="font-size: 28px; margin-right: 12px;">🧪</span>
                                        <h3 style="color: #166534; margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900;">Needs Fertilizer</h3>
                                    </div>
                                    <ul style="list-style-type: none; padding: 0 0 0 40px; margin: 0; color: #064e3b; font-weight: 600; font-size: 17px; line-height: 1.8;">
                                        ${tasks.fertilize.map(p => `<li>• ${p}</li>`).join('')}
                                    </ul>
                                </div>
                                ` : ''}

                                ${tasks.repot.length > 0 ? `
                                <div style="margin-bottom: 40px; text-align: left;">
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <span style="font-size: 28px; margin-right: 12px;">🪴</span>
                                        <h3 style="color: #b45309; margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900;">Needs Repotting</h3>
                                    </div>
                                    <ul style="list-style-type: none; padding: 0 0 0 40px; margin: 0; color: #92400e; font-weight: 600; font-size: 17px; line-height: 1.8;">
                                        ${tasks.repot.map(p => `<li>• ${p}</li>`).join('')}
                                    </ul>
                                </div>
                                ` : ''}
                            </div>

                            <!-- Centered CTA -->
                            <div style="margin-top: 50px; display: flex; justify-content: center;">
                                <a href="${frontendUrl}" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #004F3B; padding: 22px 50px; border-radius: 100px; text-decoration: none; font-size: 20px; font-weight: 900; box-shadow: 0 15px 30px rgba(251, 191, 36, 0.4); display: inline-block; text-transform: uppercase; letter-spacing: 0.05em;">Open My Dashboard</a>
                            </div>
                        </td>
                    </tr>

                    <!-- Balanced Footer -->
                    <tr>
                        <td align="center" style="padding: 60px 40px; background-color: #009966; border-top: 6px solid #004F3B;">
                            <div style="font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em; color: #ffffff; margin-bottom: 25px; opacity: 0.9;">Plant Care Reminder</div>
                            <p style="margin: 0; font-size: 15px; color: #00291fff; line-height: 1.8;">
                                Helping your plants thrive, one drop at a time.<br/>
                                <span style="display: block; margin-top: 25px; color: #ffffff; font-weight: 700; opacity: 1;">Developed with ❤️ by Dharma and Shiba</span>
                            </p>
                        </td>
                    </tr>


                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

module.exports = { getCareReportTemplate };






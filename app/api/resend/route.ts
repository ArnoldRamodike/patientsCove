// app/api/appointments/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      patientEmail, 
      patientName, 
      doctorEmail, 
      doctorName,
      appointmentDate, 
      appointmentTime,
      specialty,
      consultationFee,
      paymentMethod,
      notes,
      reason
    } = data;

    // Send email to patient
    const patientEmailResponse = await resend.emails.send({
      from: `Tzaneen Healthcare Hub <${process.env.NEXT_PUBLIC_CLINIC_EMAIL}>`,
      to: patientEmail,
      subject: `Appointment Confirmation with Dr. ${doctorName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .detail-row { display: flex; margin-bottom: 10px; }
            .detail-label { font-weight: bold; width: 150px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${patientName},</p>
              <p>Your appointment has been successfully booked.</p>
              
              <div class="details">
                <h3>Appointment Details:</h3>
                <div class="detail-row">
                  <div class="detail-label">Doctor:</div>
                  <div>Dr. ${doctorName}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Specialty:</div>
                  <div>${specialty}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Date:</div>
                  <div>${appointmentDate}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Time:</div>
                  <div>${appointmentTime}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Fee:</div>
                  <div>R${consultationFee}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Payment Method:</div>
                  <div>${paymentMethod === 'cash' ? 'Cash at Clinic' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Medical Aid'}</div>
                </div>
                ${reason ? `
                <div class="detail-row">
                  <div class="detail-label">Reason:</div>
                  <div>${reason}</div>
                </div>
                ` : ''}
                ${notes ? `
                <div class="detail-row">
                  <div class="detail-label">Notes:</div>
                  <div>${notes}</div>
                </div>
                ` : ''}
              </div>
              
              <p><strong>Important Reminders:</strong></p>
              <ul>
                <li>Please arrive 15 minutes before your appointment time</li>
                <li>Bring your ID and medical aid card (if applicable)</li>
                <li>Call us at +27 15 307 3111 if you need to reschedule</li>
              </ul>
              
              <div class="footer">
                <p>Tzaneen Healthcare Hub<br>
                R71 road in Tzaneen, Limpopo, South Africa<br>
                Phone: +27 15 307 3111 | Email: info@tzaneenealthcarehub.co.za</p>
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send email to doctor
    const doctorEmailResponse = await resend.emails.send({
      from: 'Tzaneen Healthcare Hub <appointments@tzaneenealthcarehub.co.za>',
      to: doctorEmail,
      subject: `New Appointment: ${patientName} - ${appointmentDate} ${appointmentTime}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .detail-row { display: flex; margin-bottom: 10px; }
            .detail-label { font-weight: bold; width: 150px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Appointment Scheduled</h1>
            </div>
            <div class="content">
              <p>Dear Dr. ${doctorName},</p>
              <p>A new appointment has been scheduled with you.</p>
              
              <div class="details">
                <h3>Appointment Details:</h3>
                <div class="detail-row">
                  <div class="detail-label">Patient:</div>
                  <div>${patientName}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Patient Email:</div>
                  <div>${patientEmail}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Date:</div>
                  <div>${appointmentDate}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Time:</div>
                  <div>${appointmentTime}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Fee:</div>
                  <div>R${consultationFee}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Payment Method:</div>
                  <div>${paymentMethod === 'cash' ? 'Cash at Clinic' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Medical Aid'}</div>
                </div>
                ${reason ? `
                <div class="detail-row">
                  <div class="detail-label">Reason:</div>
                  <div>${reason}</div>
                </div>
                ` : ''}
                ${notes ? `
                <div class="detail-row">
                  <div class="detail-label">Patient Notes:</div>
                  <div>${notes}</div>
                </div>
                ` : ''}
              </div>
              
              <div class="footer">
                <p>Tzaneen Healthcare Hub Appointment System<br>
                This is an automated notification.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      patientEmailId: patientEmailResponse.data?.id,
      doctorEmailId: doctorEmailResponse.data?.id,
      message: 'Confirmation emails sent successfully'
    });

  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation emails', details: error.message },
      { status: 500 }
    );
  }
}
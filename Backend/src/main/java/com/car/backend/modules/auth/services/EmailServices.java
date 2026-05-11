package com.car.backend.modules.auth.services;

import jakarta.mail.internet.MimeMessage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServices {
	
	private final JavaMailSender mailSender;
	
	@Value("${spring.mail.username}")
	private String from;
	
	public EmailServices(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}
	
	public void sendVerificationEmail(String email, String otpCode) {
		String subject = "EliteDrive - Xác thực tài khoản";
		String message = "Chào mừng bạn đến với EliteDrive. Mã OTP để kích hoạt tài khoản của bạn là:";
		sendOtpEmail(email, otpCode, subject, message);
	}

	public void sendAccountInfoEmail(String email, String username, String password) {
		String subject = "EliteDrive - Thông tin tài khoản nhân viên";
		String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <h1 style="color: #001e40; margin: 0; font-size: 24px;">EliteDrive Premium</h1>
                            <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Hệ thống quản trị đội xe chuyên nghiệp</p>
                        </div>
                        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Chào mừng bạn tham gia đội ngũ!</h2>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                                Tài khoản của bạn đã được khởi tạo bởi Quản trị viên. Bạn có thể sử dụng thông tin dưới đây để đăng nhập vào hệ thống:
                            </p>
                            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #fd7e14;">
                                <div style="margin-bottom: 10px;">
                                    <span style="color: #64748b; font-size: 12px; font-weight: bold; text-uppercase;">Tên đăng nhập:</span>
                                    <div style="color: #001e40; font-size: 18px; font-weight: bold;">%s</div>
                                </div>
                                <div>
                                    <span style="color: #64748b; font-size: 12px; font-weight: bold; text-uppercase;">Mật khẩu khởi tạo:</span>
                                    <div style="color: #001e40; font-size: 18px; font-weight: bold;">%s</div>
                                </div>
                            </div>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:5173/login" style="background-color: #001e40; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">ĐĂNG NHẬP NGAY</a>
                            </div>
                            <p style="color: #ef4444; font-size: 13px; font-weight: bold; text-align: center;">
                                * Vui lòng thay đổi mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn.
                            </p>
                        </div>
                        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 25px;">
                            © 2026 EliteDrive. Mọi quyền được bảo lưu.
                        </p>
                    </div>
                """.formatted(username, password);
		
		sendEmail(email, subject, content);
	}
	
	public void sendForgotPasswordEmail(String email, String token) {
		String subject = "EliteDrive - Liên kết đặt lại mật khẩu";
		String resetLink = "http://localhost:5173/reset-password?token=" + token;
		
		String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; background-color: #ffffff; border: 1px solid #eee;">
                        <h2 style="color: #003366; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>
                        <p style="font-size: 16px; color: #555;">Chào bạn, chúng tôi nhận được yêu cầu thay đổi mật khẩu của bạn.</p>
                        <p style="font-size: 16px; color: #555;">Vui lòng nhấn vào liên kết bên dưới để bắt đầu quá trình thiết lập mật khẩu mới:</p>
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="%s" style="background-color: #FF8C00; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">ĐẶT LẠI MẬT KHẨU</a>
                        </div>
                        <p style="font-size: 14px; color: #777;">Nếu nút trên không hoạt động, hãy nhấn trực tiếp vào đường link này:</p>
                        <p style="font-size: 14px; color: #003366; word-break: break-all;"><a href="%s">%s</a></p>
                        <p style="font-size: 13px; color: #999; margin-top: 30px;">Vì lý do bảo mật, liên kết này sẽ hết hạn sau <strong>30 phút</strong>.</p>
                    </div>
                """.formatted(resetLink, resetLink, resetLink);
		
		sendEmail(email, subject, content);
	}
	
	private void sendOtpEmail(String email, String otpCode, String subject, String message) {
		String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                        <h2 style="color: #333;">%s</h2>
                        <p style="font-size: 16px; color: #555;">%s</p>
                        <div style="display: inline-block; margin: 20px 0; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #fff; background-color: #003366; border-radius: 8px;">
                            %s
                        </div>
                        <p style="font-size: 14px; color: #777;">Mã xác thực này có hiệu lực trong <strong>5 phút</strong>.</p>
                    </div>
                """.formatted(subject, message, otpCode);
		sendEmail(email, subject, content);
	}

	private void sendEmail(String to, String subject, String content) {
		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
			
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setFrom(from);
			helper.setText(content, true);
			
			mailSender.send(mimeMessage);
			log.info("Email sent successfully to: {}", to);
		} catch (Exception e) {
			log.error("Failed to send email to {}: {}", to, e.getMessage());
		}
	}
}

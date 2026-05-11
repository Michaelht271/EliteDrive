package com.car.backend.modules.auth.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.Base64;
import java.util.Optional;

/**
 * Utility class cung cấp các hàm tiện ích để làm việc với Cookie.
 * Hỗ trợ: đọc, thêm, xóa cookie và chuyển đổi Object <-> String (serialize/deserialize).
 * Được dùng chủ yếu trong OAuth2 flow để lưu AuthorizationRequest vào Cookie
 * thay vì Session, giúp hệ thống hoàn toàn Stateless.
 */
@Component
public class CookieUtils {
	
	/**
	 * Private constructor ngăn không cho tạo instance của class này.
	 * CookieUtils chỉ chứa các static method, không cần khởi tạo.
	 */
	private CookieUtils() {
		/* This utility class should not be instantiated */
	}
	
	/**
	 * Tìm và trả về một Cookie theo tên từ HTTP Request.*
	 *
	 * Hoạt động: Browser gửi tất cả cookie lên trong Request Header.
	 * Hàm này duyệt qua danh sách đó để tìm đúng cookie cần lấy.
	 *
	 * @param httpServletRequest Request từ browser gửi lên
	 * @param name               Tên cookie cần tìm
	 * @return Optional chứa Cookie nếu tìm thấy, Optional.empty() nếu không có
	 */
	public static Optional<Cookie> getCookie(HttpServletRequest httpServletRequest, String name) {
		Cookie[] cookies = httpServletRequest.getCookies();
		
		// Kiểm tra null vì getCookies() trả về null nếu request không có cookie nào
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					return Optional.of(cookie);
				}
			}
		}
		return Optional.empty();
	}
	
	/**
	 * Tạo một Cookie mới và gửi về Browser thông qua HTTP Response.
	 *
	 * Hoạt động: Cookie không lưu trên Server mà gửi về Browser qua Response Header:
	 * "Set-Cookie: <name>=<value>; Path=/; HttpOnly; Max-Age=<maxAge>"
	 * Browser nhận header đó và tự động lưu cookie, rồi gửi lại mỗi request tiếp theo.
	 *
	 * @param httpServletResponse Response để ghi cookie vào Header trả về Browser
	 * @param name                Tên cookie
	 * @param value               Giá trị cookie (thường là chuỗi đã được Base64 encode)
	 * @param maxAge              Thời gian sống tính bằng giây (vd: 180 = 3 phút)
	 */
	public static void addCookie(HttpServletResponse httpServletResponse,
	                             String name, String value, int maxAge) {
		Cookie cookie = new Cookie(name, value);
		cookie.setPath("/");         // Cookie áp dụng cho toàn bộ đường dẫn của app
		cookie.setHttpOnly(true);    // Chặn JavaScript đọc cookie, chống tấn công XSS
		cookie.setMaxAge(maxAge);    // Thời gian hết hạn
		httpServletResponse.addCookie(cookie);
	}
	
	/**
	 * Xóa một Cookie khỏi Browser bằng cách ghi đè giá trị và thời gian hết hạn.
	 *
	 * Hoạt động: Không có cơ chế "xóa cookie" trực tiếp trong HTTP.
	 * Cách duy nhất là gửi lại cookie cùng tên với maxAge = 0,
	 * Browser nhận được sẽ tự động xóa cookie đó.
	 *
	 * Lưu ý: Tham số value và maxAge trong hàm này nên luôn truyền vào
	 * là ("", 0) để thực sự xóa cookie.
	 *
	 * @param httpServletRequest  Request để lấy danh sách cookie hiện có
	 * @param httpServletResponse Response để gửi lệnh xóa về Browser
	 * @param name                Tên cookie cần xóa
	 * @param value               Giá trị mới (nên truyền "" khi xóa)
	 * @param maxAge              Thời gian sống mới (nên truyền 0 để xóa ngay)
	 */
	public static void deleteCookie(HttpServletRequest httpServletRequest,
	                                HttpServletResponse httpServletResponse,
	                                String name, String value, int maxAge) {
		Cookie[] cookies = httpServletRequest.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					cookie.setValue(value);   // Ghi đè giá trị cũ
					cookie.setPath("/");
					cookie.setHttpOnly(true);
					cookie.setMaxAge(maxAge); // maxAge = 0 -> Browser xóa cookie
					httpServletResponse.addCookie(cookie);
				}
			}
		}
	}
	
	/**
	 * Chuyển đổi một Object thành chuỗi Base64 để lưu vào Cookie.
	 *
	 * Vì Cookie chỉ lưu được String, cần serialize Object thành bytes
	 * rồi encode sang Base64 để có thể lưu trữ an toàn.
	 *
	 * Luồng: Object -> byte[] (Java Serialization) -> Base64 String
	 *
	 * @param object Object cần serialize (vd: OAuth2AuthorizationRequest)
	 * @return Chuỗi Base64 đại diện cho object
	 */
	public static String serialize(Object object) {
		return Base64.getUrlEncoder()
		             .encodeToString(SerializationUtils.serialize(object));
	}
	
	/**
	 * Chuyển đổi giá trị Cookie (Base64 String) trở lại thành Object gốc.
	 *
	 * Luồng ngược lại với serialize:
	 * Base64 String -> byte[] (Base64 decode) -> Object (Java Deserialization)
	 *
	 * @param cookie Cookie chứa dữ liệu đã được serialize
	 * @param cls    Class của Object cần phục hồi (vd: OAuth2AuthorizationRequest.class)
	 * @return Object đã được phục hồi, hoặc null nếu xảy ra lỗi
	 */
	public static <T> T deserialize(Cookie cookie, Class<T> cls) {
		try (ByteArrayInputStream bis = new ByteArrayInputStream(Base64.getUrlDecoder().decode(cookie.getValue()));
		     ObjectInputStream ois = new java.io.ObjectInputStream(bis)) {
			return cls.cast(ois.readObject());
		} catch (Exception e) {
			// Trả về null nếu cookie bị lỗi, hết hạn hoặc bị giả mạo
			return null;
		}
	}
}
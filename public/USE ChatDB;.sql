USE ChatDB;
GO

-- Xóa sạch tin nhắn cũ để bắt đầu chat theo cặp mới
TRUNCATE TABLE Messages;
GO

-- Kiểm tra xem bảng đã có đủ cột chưa
SELECT TOP 1 * FROM Messages;
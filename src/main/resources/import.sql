INSERT INTO users (ID, CREATED_AT, DEVICE_UUID, UPDATED_AT, USERNAME) 
VALUES 
(1, '2025-02-17 10:00:00', 'uuid-1234-abcd', '2025-02-17 12:00:00', 'user1'),
(2, '2025-02-17 11:30:00', 'uuid-5678-efgh', '2025-02-17 13:15:00', 'user2');

System.out.println("✅ SQL 初始化成功！users 表共有 2 条数据。");  

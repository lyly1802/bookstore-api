#  Bookstore API (Node.js + Prisma)

Backend API cho hệ thống bán sách sử dụng Node.js, Express, Prisma ORM và MySQL.

---

##  Công nghệ sử dụng

- **Node.js + Express** – Xây dựng API RESTful
- **Prisma ORM** – Quản lý database MySQL
- **MySQL** – Cơ sở dữ liệu
- **JWT** – Xác thực người dùng
- **Google OAuth** – Đăng nhập bằng Google
- **Multer + Cloudinary** – Upload ảnh
- **Nodemailer** – Gửi email quên mật khẩu

---

## Chức năng chính

###  Xác thực & người dùng
- Đăng ký, đăng nhập
- Đăng nhập bằng Google
- Quên mật khẩu (gửi email reset)
- Phân quyền: `USER` / `ADMIN`

### 📚 Quản lý sách (CRUD)
- Thêm sách
- Cập nhật thông tin sách
- Xoá sách
- Lấy danh sách sách (theo thể loại, nhà xuất bản,...)

## ⚙️ Cấu hình `.env`

1. Tạo file `.env` tại thư mục gốc
2. Dựa theo file mẫu `.env.example`
3. Điền thông tin thật của bạn (MySQL, Google OAuth, email,...)


### 🖼️ Upload ảnh với Cloudinary

Dự án sử dụng **Cloudinary** để upload và lưu trữ ảnh (ví dụ: ảnh sách).

Cấu hình Cloudinary được tách riêng trong file:  
 `config/cloudinary.js` để đảm bảo **dễ bảo trì và tái sử dụng** trong toàn dự án.

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret



## Cài đặt dự án

```bash
git clone https://github.com/lyly1802/bookstore-api.git
cd bookstore-api
npm install
chay bằng lệnh :nodemon app.js

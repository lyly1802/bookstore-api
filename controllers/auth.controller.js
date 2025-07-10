import prisma from '../models/prismaClient.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
  const { email, password, name, address, phone } = req.body;// B1:Lấy dữ liệu người dùng gửi từ form đăng ký.
  try {
    //B2:Kiểm tra email đã có trong CSDL chưa. Nếu có → báo lỗi không cho đăng ký
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ mess: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);//B3:Mã hóa mật khẩu trước khi lưu vào CSDL

    //B4:Tạo người dùng mới trong bảng users. Mật khẩu đã được mã hóa. Mặc định role là 'USER'
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        address,
        phone,
        role: 'USER',
      },
    });
//B5: Trả về thông báo thành công + dữ liệu người dùng mới tạo.
    return res.status(201).json({ mess: 'Đăng ký thành công', user });
  } catch (error) {
    return res.status(500).json({ mess: 'Lỗi server', error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;//B1:Lấy email và mật khẩu từ form đăng nhập.
  //B2:Tìm người dùng trong CSDL theo email. Nếu không tìm thấy → trả lỗi.
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ mess: 'Email không tồn tại' });
//B3:So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB. Nếu sai → báo lỗi.
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ mess: 'Mật khẩu sai' });
//B4:Tạo JWT token để xác thực người dùng sau này. Payload chứa: email, name, role. Hết hạn sau 1 ngày.
    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      process.env.KEY,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ mess: 'Đăng nhập thành công', token ,
      user: { name: user.name, role: user.role, email: user.email,

 },

    });
  } catch (error) {
    return res.status(500).json({ mess: 'Lỗi server', error });
  }
};


//đăng nhập bằng Google
//B1:Import thư viện của Google để dùng phương thức xác thực verifyIdToken.
import { OAuth2Client } from 'google-auth-library';
//B2:Khởi tạo client xác thực,Tạo một đối tượng client để dùng cho việc xác minh token.
//GOOGLE_CLIENT_ID phải giống với client ID bạn dùng trên frontend (Google console cung cấp).
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//B3
export const googleLogin = async (req, res) => {
  //BƯỚC 4: Lấy token từ FE gửi về vd:{ "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6..." }
  const { token } = req.body;
  if (!token) return res.status(400).json({ mess: 'Thiếu token từ frontend' });

  try {
    //BƯỚC 5:gửi token đến Google để hỏi rằng người đăng nhập thực sự là người dùng Google
//Là xác minh xem token đó có thật sự được Google cấp và dùng cho ứng dụng của bạn không.
    const ticket = await client.verifyIdToken({
 //là chuỗi mã token mà frontend gửi lên. 
 // Google đã cấp nó cho người dùng sau khi họ bấm nút “Đăng nhập bằng Google”.
      idToken: token,
//là Client ID mà bạn lấy từ Google Console,Google kiểm tra rằng token này đúng là dành cho app này.
      audience: process.env.GOOGLE_CLIENT_ID,
    });
//BƯỚC 6: Lấy thông tin người dùng từ ticket
    const payload = ticket.getPayload();//giúp bạn lấy toàn bộ thông tin người dùng trong ticket đó.
   //Trong payload thường có:email,name,ảnh...nhưng ở đây chỉ lấy ra email,name
    const { email, name } = payload;
//BƯỚC 7: Kiểm tra người dùng trong CSDL
//Người dùng với email đó đã tồn tại trong bảng users của bạn chưa?
//Nếu user đã tồn tại	Bạn sẽ đăng nhập cho họ luôn (Bước 9).
    let user = await prisma.users.findUnique({ where: { email } });
    //BƯỚC 8: Nếu chưa có user → tạo mới
    if (!user) {
      user = await prisma.users.create({
        data: {
          email,
          name,
          password: '',
          address: '',
          phone: '',
          role: 'USER',
        },
      });
    }
//Bước 9 tạo JWT là cách để gói gọn thông tin người dùng vào 1 chuỗi bảo mật eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...
    const jwtToken = jwt.sign(
      { email: user.email, name: user.name, role: user.role },//// dữ liệu
      process.env.KEY,//// secret key để mã hóa token
      { expiresIn: '1d' }//// token có hiệu lực trong 1 ngày
    );
//BƯỚC 10: Trả dữ liệu về frontend
    return res.status(200).json({
      mess: 'Đăng nhập Google thành công',
      token: jwtToken,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(' Google Login Failed:', err);
    return res.status(401).json({ mess: 'Xác thực Google thất bại', error: err });
  }
};



//gửi password qua gmail 
import { sendMail } from '../helpers/send.mail.js';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ mess: 'Email không hợp lệ' });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ mess: 'Email không tồn tại trong hệ thống' });
    }

    // Tạo mật khẩu mới ngẫu nhiên
    const newPassword = Math.random().toString(36).slice(-8); // VD: 'a1b2c3d4'

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới vào DB
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Gửi email chứa mật khẩu mới
    await sendMail({
      email,
      subject: 'Mật khẩu mới của bạn',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #4A90E2;">🔒 Đặt lại mật khẩu</h2>
            <p style="font-size: 16px;">Chào bạn, <strong style="color: #333;">${user.name}</strong></p>
            <p style="font-size: 16px;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
            <p style="font-size: 16px;">Mật khẩu mới của bạn là:</p>
            <div style="background: #f0f0f0; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 18px; text-align: center; letter-spacing: 1px;">
              ${newPassword}
            </div>
            <p style="font-size: 16px; margin-top: 20px;">Hãy đăng nhập và đổi lại mật khẩu để đảm bảo an toàn cho tài khoản của bạn.</p>
            <hr style="margin: 30px 0;" />
            <p style="font-size: 14px; color: #888;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <p style="font-size: 14px; color: #888;">Trân trọng, <br />Đội ngũ Hỗ trợ WEB BAN HANG</p>
          </div>
        </div>
`

    });

    res.status(200).json({ mess: 'Đã gửi mật khẩu mới đến email của bạn' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mess: 'Có lỗi xảy ra, vui lòng thử lại sau' });
  }
};

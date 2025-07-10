import prisma from '../models/prismaClient.js';

export const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json({ data: books });
  } catch (error) {
    res.status(500).json({ mess: "Lỗi server", error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const {
      book_id,
      book_name,
      description,
      price,
      img,
      pub_id,
      cat_id,
      status,
    } = req.body;

    // return res.json(req.body);
    if (!book_id || !book_name || price == null || !img || !pub_id || !cat_id) {
      return res.status(400).json({ mess: "Thiếu thông tin bắt buộc" });
    }

    const newBook = await prisma.book.create({
      data: {
        book_id,
        book_name,
        description,
        price: Number(price),
        img,
        pub_id,
        cat_id,
        status: status === true, // Nếu không truyền thì mặc định là false
      },
    });

    res.json({ mess: "Thêm sách thành công", data: newBook });
  } catch (error) {
    res.status(500).json({ mess: "Lỗi server", error: error.message });
  }
};



export const deleteBook = async (req, res) => {
  try {
    const { book_id } = req.params;

    if (!book_id) {
      return res.status(400).json({ mess: "Thiếu mã sách cần xóa" });
    }

    // Kiểm tra sách có tồn tại không
    const existingBook = await prisma.book.findUnique({
      where: { book_id },
    });

    if (!existingBook) {
      return res.status(404).json({ mess: "Không tìm thấy sách" });
    }

    // Xóa sách
    await prisma.book.delete({
      where: { book_id },
    });

    res.json({ mess: "Xóa sách thành công" });
  } catch (error) {
    res.status(500).json({ mess: "Lỗi server", error: error.message });
  }
};


//cập nhật sách
export const updateBook = async (req, res) => {
  try {
    const { book_id } = req.params;
    const {
      book_name,
      description,
      price,
      img,
      pub_id,
      cat_id,
      status,
    } = req.body;

    if (!book_id) {
      return res.status(400).json({ mess: "Thiếu mã sách cần cập nhật" });
    }

    // Kiểm tra sách có tồn tại không
    const existingBook = await prisma.book.findUnique({
      where: { book_id },
    });

    if (!existingBook) {
      return res.status(404).json({ mess: "Không tìm thấy sách để cập nhật" });
    }

    // Cập nhật sách
    const updatedBook = await prisma.book.update({
      where: { book_id },
      data: {
        book_name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        img,
        pub_id,
        cat_id,
        status,
      },
    });

    res.json({ mess: "Cập nhật sách thành công", data: updatedBook });
  } catch (error) {
    res.status(500).json({ mess: "Lỗi server", error: error.message });
  }
};

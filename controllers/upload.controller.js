export const uploadImage = async (req, res) => {
  try {
    const img = req.file;

    res.json({
      code: 200,
      message: "Tải lên thành công",
      data: { 
        img:{
           path: img.path  

      } }
    });
  } catch (error) {
    res.status(500).json({ mess: "Lỗi server", error });
  }
};

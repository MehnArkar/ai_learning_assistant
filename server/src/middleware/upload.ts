import multer from "multer";
import path from "path";

const uploadsDir = path.join(process.cwd(),'uploads');

const storage = multer.diskStorage({
    destination: (_req, _file,cb) => {
        cb(null,uploadsDir)
    },
    filename:(_req, file, cb)=> {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `${unique}${ext}`)
    }
})


const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      cb(new Error('Only PDF files are allowed'))
      return
    }
    cb(null, true)
}

export const uploadPdf = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 },
})
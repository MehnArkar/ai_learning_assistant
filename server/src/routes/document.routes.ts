import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { create, favorite, list, remove, rename } from '../controllers/document.controller'
import { uploadPdf } from '../middleware/upload'
import { validateRequest } from '../middleware/validate'
import {
  createDocumentRules,
  documentIdRules,
  listDocumentsRules,
  renameDocumentRules,
} from '../validators/document.validator'
import { requirePdfFile } from '../middleware/requireFile'

const router = Router()

router.use(authMiddleware)

router.get('/', listDocumentsRules, validateRequest, list)

router.post(
  '/',
  uploadPdf.single('file'),
  requirePdfFile,
  createDocumentRules,
  validateRequest,
  create
)

router.patch('/:id/favorite', documentIdRules, validateRequest, favorite)

router.patch('/:id', renameDocumentRules, validateRequest, rename)

router.delete('/:id', documentIdRules, validateRequest, remove)

export default router

import { Response } from 'express'
import { AuthRequest, getUserId } from '../middleware/auth.middleware'
import {
  createDocument,
  deleteDocument,
  listDocuments,
  renameDocument,
  toggleFavorite,
} from '../services/document.services'

const getDocumentId = (req: AuthRequest): string => {
  const id = req.params.id
  if (typeof id !== 'string') {
    throw new Error('Invalid document id')
  }
  return id
}

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req)
    const search = typeof req.query.search === 'string' ? req.query.search : undefined
    const favorite = req.query.favorite === 'true'

    const documents = await listDocuments(userId, search, favorite)
    res.status(200).json({
      success: true,
      message: 'Documents fetched',
      data: documents,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch documents'
    res.status(400).json({ success: false, message })
  }
}

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await createDocument({
      userId: getUserId(req),
      name: req.body.name,
      file: req.file!,
    })

    res.status(201).json({
      success: true,
      message: 'Document uploaded',
      data,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create document'
    res.status(400).json({ success: false, message })
  }
}

export const favorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await toggleFavorite(getUserId(req), getDocumentId(req))
    res.status(200).json({
      success: true,
      message: 'Favorite updated',
      data,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update favorite'
    res.status(404).json({ success: false, message })
  }
}

export const rename = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await renameDocument(getUserId(req), getDocumentId(req), req.body.name)
    res.status(200).json({
      success: true,
      message: 'Document renamed',
      data,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to rename document'
    res.status(404).json({ success: false, message })
  }
}

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await deleteDocument(getUserId(req), getDocumentId(req))
    res.status(200).json({
      success: true,
      message: 'Document deleted',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete document'
    res.status(404).json({ success: false, message })
  }
}

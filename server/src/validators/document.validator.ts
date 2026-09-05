import { body, param, query } from 'express-validator'

export const listDocumentsRules = [
  query('search').optional().trim().isString(),
  query('favorite')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('favorite must be true or false'),
]

export const createDocumentRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Document name is required')
    .isLength({ max: 200 })
    .withMessage('Name must be at most 200 characters'),
]

export const documentIdRules = [
  param('id')
    .notEmpty()
    .withMessage('id should not be empty')
    .isMongoId()
    .withMessage('id should be mongoId'),
]

export const renameDocumentRules = [
  ...documentIdRules,
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 200 })
    .withMessage('Name must be at most 200 characters'),
]

import { body } from 'express-validator'
import { documentIdRules } from './document.validator'

export const sendMessageRules = [
  ...documentIdRules,
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message must be at most 2000 characters'),
]

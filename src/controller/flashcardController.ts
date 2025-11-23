import { Request, Response } from "express";
import { FlashcardService } from "../service/flashcardService";
import { json } from "stream/consumers";

const flashcardService = new FlashcardService();

export class FlashcardController {


    // CONTROLLER WITH FLASH CARD DECK
    static async createFlashcardDeck(req: Request, res: Response) {
        try {
            // Debug: Log to see what's received
            console.log('=== CREATE DECK REQUEST ===');
            console.log('Request body:', req.body);
            console.log('Request body type:', typeof req.body);
            console.log('Request body keys:', Object.keys(req.body || {}));
            console.log('Content-Type:', req.headers['content-type']);
            
            const { name, description } = req.body;
            const userId = req.user?.id;
            
            console.log('Extracted name:', name, 'Type:', typeof name);
            console.log('Extracted description:', description);
            console.log('User ID:', userId);
            
            // Validate user
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            
            // Validate that name is provided and not empty
            // Check for both undefined, null, empty string, and whitespace-only strings
            if (name === undefined || name === null || name === '' || (typeof name === 'string' && name.trim() === '')) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required and cannot be empty",
                    debug: {
                        receivedBody: req.body,
                        bodyKeys: Object.keys(req.body || {}),
                        nameValue: name,
                        nameType: typeof name,
                        nameIsUndefined: name === undefined,
                        nameIsNull: name === null,
                        nameIsEmpty: name === ''
                    }
                });
            }
            
            // Prepare deck data - ensure name is a string and trimmed
            const deckData: any = {
                userId: userId,
                name: String(name).trim()
            };
            
            // Only add description if it's provided
            if (description !== undefined && description !== null && description !== '') {
                deckData.description = String(description).trim();
            }
            
            console.log('Deck data to save:', deckData);
            
            const deck = await flashcardService.createDeck(deckData);
            res.status(201).json({
                success: true,
                data: deck,
                message: "Deck created successfully"
            });
        } catch (error: any) {
            console.error('Error creating deck:', error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to create deck",
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    static async getAllDeck(req: Request, res: Response) {
        const allDeck = await flashcardService.getAllDeck()
        res.status(200).json({
            success: true,
            data: allDeck,
            message: "Lay tat ca deck",
        })
    }

    static async getDeckById(req: Request, res: Response) {
        const deckId = req.params.id
        const deckItem = await flashcardService.getDeckbyId(deckId)
        res.status(200).json({
            success: true,
            data: deckItem,
            message: "Get Deck by ID",
        })
    }
    static async updateDeck(req: Request, res: Response) {
        const deckId = req.params.id
        const deckData = req.body
        const deckItem = await flashcardService.updateDeck(deckData, deckId)
        res.status(200).json({
            success: true,
            data: deckItem,
            message: "Get Deck by ID",
        })
    }
    static async deleteDeck(req: Request, res: Response) {
        const deckId = req.params.id
        await flashcardService.deleteDeck(deckId)
        res.status(204).json({
            message: "Da xoa thanh cong"
        })
    }


    // CONTROLLER WITH FLASH CARD 

    static async createFlashCard(req: Request, res: Response) {
        const deckId = req.params.id
        const { front, back } = req.body

        const flashcard = {
            deckId: deckId,
            front: front,
            back: back
        }
        const flashcardData = await flashcardService.createflashcard(flashcard)
        res.status(201).json({
            success: true,
            data: flashcardData,
            message: "TAO THANH CONG"
        })
    }


    static async updateflashcard(req: Request, res: Response) {
        const cardId = req.params.id;
        const cardData = req.body
        if (!cardId) {
            throw new Error("KO co card Id nay")
        }
        const flashcard = await flashcardService.updateflashcard(cardId, cardData)
        res.status(201).json({
            success: true,
            data: flashcard,
            message: "UPDATE THANH CONG"
        })

    }

    static async deleteCard(req: Request, res: Response) {
        const cardId = req.params.id
        await flashcardService.deleteCard(cardId)
        res.status(204).json({
            message: "Da xoa thanh cong"
        })
    }

    static async getAllFlashcard(req: Request, res: Response) {
        const deckId = req.params.deckId
        const allFlashcard = await flashcardService.getAllflashcard(deckId)
        res.status(200).json({
            data: allFlashcard,
            message: "Get thanh cong"
        })
    }
}
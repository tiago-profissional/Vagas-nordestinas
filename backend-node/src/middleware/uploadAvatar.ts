import type { NextFunction, Request, Response } from "express";
import multer from "multer";

import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

export const avatarUrlPrefix = "/uploads/avatars";
export const uploadsDir = path.resolve(process.cwd(), "uploads");
export const avatarDir = path.join(uploadsDir, "avatars");

mkdirSync(avatarDir, { recursive: true });

// A extensão vem do tipo da imagem, nunca do nome enviado pelo usuário.
const extensoes: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, avatarDir),
    filename: (_req, file, cb) =>
      cb(null, `${randomUUID()}${extensoes[file.mimetype] ?? ""}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (extensoes[file.mimetype]) {
      cb(null, true);
      return;
    }

    cb(new Error("Envie uma imagem PNG, JPG ou WebP."));
  },
});

export function receberAvatar(req: Request, res: Response, next: NextFunction) {
  upload.single("avatar")(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ message: "A imagem deve ter no máximo 2 MB." });
      return;
    }

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a imagem.",
    });
  });
}
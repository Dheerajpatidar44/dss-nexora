import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authenticate } from "../middleware/auth.middleware";
import { ApiResponse } from "../utils/apiResponse";
import { logger } from "../config/logger";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
    }
  },
});

// Upload single image to Cloudinary
router.post("/image", authenticate, upload.single("image"), async (req, res) => {
  if (!req.file) return ApiResponse.badRequest(res, "No image provided");

  const folder = req.body.folder || "general";

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `dss-nexus/${folder}`, quality: "auto", fetch_format: "auto" },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      }
    );

    ApiResponse.success(res, {
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    logger.error("Cloudinary upload error:", error);
    ApiResponse.error(res, "Image upload failed");
  }
});

// Upload multiple images
router.post("/images", authenticate, upload.array("images", 10), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) return ApiResponse.badRequest(res, "No images provided");

  const folder = req.body.folder || "general";

  try {
    const uploads = await Promise.all(
      files.map(
        (file) =>
          new Promise<{ url: string; publicId: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: `dss-nexus/${folder}`, quality: "auto", fetch_format: "auto" },
              (error, result) => {
                if (error || !result) reject(error);
                else resolve({ url: result.secure_url, publicId: result.public_id });
              }
            );
            stream.end(file.buffer);
          })
      )
    );

    ApiResponse.success(res, uploads);
  } catch (error) {
    logger.error("Cloudinary multi-upload error:", error);
    ApiResponse.error(res, "Image upload failed");
  }
});

// Delete image from Cloudinary
router.delete("/image", authenticate, async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return ApiResponse.badRequest(res, "publicId is required");

  await cloudinary.uploader.destroy(publicId);
  ApiResponse.success(res, null, "Image deleted");
});

export default router;

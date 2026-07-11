import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api.deps import get_current_admin
from app.core.config import settings
from app.models.admin import Admin

router = APIRouter(prefix="/uploads", tags=["uploads"])

_UPLOAD_FOLDER = "vikus-little-loops"


def _configure():
    if not settings.CLOUDINARY_CLOUD_NAME:
        raise HTTPException(status_code=400, detail="Cloudinary is not configured")
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    _: Admin = Depends(get_current_admin),
):
    """Upload an image to Cloudinary; auto WebP + optimized delivery URL."""
    _configure()
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=422, detail="File must be an image")
    contents = await file.read()
    result = cloudinary.uploader.upload(
        contents,
        folder=_UPLOAD_FOLDER,
        resource_type="image",
        format="webp",
        quality="auto",
        fetch_format="auto",
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "width": result.get("width"),
        "height": result.get("height"),
    }


@router.delete("/image")
def delete_image(public_id: str, _: Admin = Depends(get_current_admin)):
    _configure()
    result = cloudinary.uploader.destroy(public_id)
    return {"result": result.get("result", "ok")}


_MAX_REVIEW_PHOTO_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/review-photo")
async def upload_review_photo(file: UploadFile = File(...)):
    """Public — customers attach a photo to their review.

    Safe to expose: reviews are hidden until an admin approves them,
    and this only accepts images up to 5 MB.
    """
    _configure()
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=422, detail="File must be an image")
    contents = await file.read()
    if len(contents) > _MAX_REVIEW_PHOTO_BYTES:
        raise HTTPException(status_code=413, detail="Image must be under 5 MB")
    result = cloudinary.uploader.upload(
        contents,
        folder=f"{_UPLOAD_FOLDER}/reviews",
        resource_type="image",
        format="webp",
        quality="auto",
        fetch_format="auto",
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}

"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { getCroppedImg } from '@/lib/imageUtils';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ProfilePictureCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onClose: () => void;
}

export function ProfilePictureCropper({ imageSrc, onCropComplete, onClose }: ProfilePictureCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  // Callbacks for the Slider component (receives number[])
  const handleSliderZoomChange = useCallback((value: number[]) => {
    setZoom(value[0]);
  }, []);

  const handleSliderRotationChange = useCallback((value: number[]) => {
    setRotation(value[0]);
  }, []);

  // Callbacks for the Cropper component (receives single number)
  const handleCropperZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCropperRotationChange = useCallback((newRotation: number) => {
    setRotation(newRotation);
  }, []);

  const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, imageSrc, onCropComplete, onClose]);

  return (
    <div className="space-y-4">
      <div className="relative w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1} // Square aspect ratio for profile pictures
          onCropChange={onCropChange}
          onZoomChange={handleCropperZoomChange} // Pass the function that expects a single number
          onRotationChange={handleCropperRotationChange} // Pass the function that expects a single number
          onCropComplete={onCropCompleteCallback}
          cropShape="round" // Circular crop area
          showGrid={false}
        />
      </div>

      <div className="flex items-center space-x-4">
        <Label className="flex items-center space-x-2 min-w-[60px]">
          <ZoomOut className="h-4 w-4 text-muted-foreground" />
          <span>Zoom</span>
        </Label>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={[zoom]}
          onValueChange={handleSliderZoomChange} // Pass the function that expects a number[]
          className="flex-1"
        />
        <ZoomIn className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-center space-x-4">
        <Label className="flex items-center space-x-2 min-w-[60px]">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          <span>Rotate</span>
        </Label>
        <Slider
          min={0}
          max={360}
          step={1}
          value={[rotation]}
          onValueChange={handleSliderRotationChange} // Pass the function that expects a number[]
          className="flex-1"
        />
      </div>

      <DialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </DialogFooter>
    </div>
  );
}
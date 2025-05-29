/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-console */
import React from "react";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";

import CameraIcon from "../icons/CameraIcon";
import ReloadIcon from "../icons/ReloadIcon";

// Define the interface for Store data
export interface Store {
  name: string;
  direction: string;
  image: string | null; // Changed to allow null for image if not provided/captured
  [key: string]: FormDataEntryValue | string | null;
}

interface FormAddStoreProps {
  onSubmit(data: Partial<Store>): void; // Renamed for clarity for stores
}

export const FormAddStore = ({ onSubmit }: FormAddStoreProps) => {
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(
    null,
  );
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [showCapturedPreview, setShowCapturedPreview] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<Store> = {};

    formData.forEach((value, key) => {
      data[key as keyof Store] = value;
    });

    if (capturedImage) {
      data.image = capturedImage;
    } else {
      const imageFile = fileInputRef.current?.files?.[0];

      // Use the image file name or a placeholder if no file/camera image
      data.image = imageFile ? imageFile.name : null;
    }

    // Basic validation for name and direction (assuming they are required)
    if (data.name && data.direction !== undefined) {
      onSubmit(data);
    } else {
      console.error("Please fill in all required fields (Name and Direction).");
    }
  };

  const handleOpenCamera = async () => {
    setShowCamera(true);
    setCapturedImage(null); // Clear any previously captured image

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        setCameraStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access camera. Please check permissions.");
        setShowCamera(false);
      }
    } else {
      alert("Your browser does not support camera access.");
      setShowCamera(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");

        setCapturedImage(imageDataUrl);
        setShowCapturedPreview(true);

        setTimeout(() => {
          setShowCapturedPreview(false);
        }, 3000);

        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
          setCameraStream(null);
        }

        setShowCamera(false);
      }
    }
  };

  const handleCancelCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null); // Clear captured image on cancel
  };

  const handleClearCapturedImage = () => {
    setCapturedImage(null);
  };

  return (
    <Form className="" onSubmit={handleSubmit}>
      <Input
        isRequired
        className="mb-4"
        label="Store Name" // Changed label
        labelPlacement="outside"
        name="name"
        placeholder="e.g., Downtown Groceries" // Changed placeholder
        type="text"
        validate={(value: string) => {
          if (value && value.length < 3) {
            return "Store name must be at least 3 characters long"; // Changed validation message
          }
          return null;
        }}
      />

      <Input
        isRequired // Assuming direction is required
        className="mb-4"
        label="Direction" // Changed label
        labelPlacement="outside"
        name="direction"
        placeholder="e.g., 123 Main St, City, Country" // Changed placeholder
        type="text"
      />

      <div className="mb-6 w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1.5"
          htmlFor="store-image" // Changed htmlFor
        >
          Store Image
        </label>

        <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
          {capturedImage ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
              <Input
                disabled
                readOnly
                className="w-full"
                value="📸 Photo taken with camera" // Changed text
              />

              <Button
                isIconOnly
                aria-label="Clear photo" // Changed aria-label
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                radius="full"
                size="sm"
                onPress={handleClearCapturedImage}
              >
                <ReloadIcon className="size-5" />
              </Button>
            </div>
          ) : (
            <Input
              ref={fileInputRef}
              accept="image/*"
              className="flex-grow"
              disabled={showCamera}
              id="store-image" // Changed id
              labelPlacement="outside"
              name="image"
              placeholder="Upload an image"
              type="file"
            />
          )}

          {!capturedImage && (
            <Button
              isIconOnly
              aria-label="Take a photo"
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
              radius="full"
              size="sm"
              onPress={handleOpenCamera}
            >
              <CameraIcon className="size-5" />
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Upload a picture or use your camera.
        </p>

        {showCamera && (
          <div className="mt-4 p-2 rounded-md flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md rounded-md mb-2"
            />
            <div className="flex gap-2">
              <Button color="primary" onClick={handleCapturePhoto}>
                Capture Photo
              </Button>
              <Button
                color="danger"
                variant="light"
                onPress={handleCancelCamera}
              >
                Cancel Camera
              </Button>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        {showCapturedPreview && capturedImage && (
          <div className="mt-4 p-2 rounded-md text-center">
            <h4 className="text-sm font-medium mb-2">
              Captured Image Preview:
            </h4>
            <img
              alt="Captured Store" // Changed alt text
              className="max-w-full h-auto rounded-md"
              src={capturedImage}
            />
          </div>
        )}
      </div>

      <Button className="w-full" color="success" type="submit">
        Add Store
      </Button>
    </Form>
  );
};

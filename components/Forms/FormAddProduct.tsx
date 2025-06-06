/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-console */
import React from "react";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";

import CameraIcon from "../icons/CameraIcon";
import ReloadIcon from "../icons/ReloadIcon";

interface ProductData {
  name: string;
  description: string;
  image: string | null;
  [key: string]: FormDataEntryValue | string | null;
}

interface FormAddProduct {
  onSubit(data: Partial<ProductData>): void;
  loading: boolean;
}

export const FormAddProduct = ({ onSubit, loading }: FormAddProduct) => {
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<ProductData> = {};

    formData.forEach((value, key) => {
      data[key as keyof ProductData] = value;
    });

    if (capturedImage) {
      data.image = capturedImage;
    } else {
      const imageFile = fileInputRef.current?.files?.[0];

      if (imageFile) {
        const reader = new FileReader();

        reader.onloadend = () => {
          // Convertir la imagen cargada a base64 con menor calidad (60%)
          const image = new Image();

          image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (ctx) {
              // Ajustar el tamaño del canvas según la imagen
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0, image.width, image.height);

              // Guardar la imagen como base64 con calidad reducida (0.6)
              const dataUrl = canvas.toDataURL("image/jpeg", 0.6);

              data.image = dataUrl; // Establecer la imagen en base64
              onSubit(data); // Llamar a la función de submit con el base64
            }
          };
          image.src = reader.result as string;
        };

        reader.readAsDataURL(imageFile); // Leer el archivo como base64
      } else {
        console.error("No image selected");
      }
    }
  };

  const handleOpenCamera = async () => {
    setShowCamera(true);
    setCapturedImage(null);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Forzar la cámara trasera
          },
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

        // Reducir la calidad de la imagen capturada
        const img = new Image();

        img.onload = () => {
          const canvas2 = document.createElement("canvas");
          const ctx2 = canvas2.getContext("2d");

          if (ctx2) {
            canvas2.width = img.width;
            canvas2.height = img.height;
            ctx2.drawImage(img, 0, 0, img.width, img.height);

            // Convertir a base64 con calidad reducida
            const reducedQuality = canvas2.toDataURL("image/jpeg", 0.6);

            setCapturedImage(reducedQuality);
            setShowCapturedPreview(true);

            setTimeout(() => {
              setShowCapturedPreview(false);
            }, 3000);
          }
        };
        img.src = imageDataUrl; // Establecer el source de la imagen

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
    setCapturedImage(null);
  };

  const handleClearCapturedImage = () => {
    setCapturedImage(null);
  };

  return (
    <Form className="" onSubmit={onSubmit}>
      <Input
        isRequired
        className="mb-4"
        label="Product Name"
        labelPlacement="outside"
        name="name"
        placeholder="e.g., Ultra HD Monitor"
        type="text"
        validate={(value: string) => {
          if (value && value.length < 3) {
            return "Product name must be at least 3 characters long";
          }

          return null;
        }}
      />

      <Input
        className="mb-4"
        label="Description"
        labelPlacement="outside"
        name="description"
        placeholder="e.g., Experience vivid colors and sharp details."
        type="text"
      />

      <div className="mb-6 w-full">
        <label
          className="block text-sm font-medium text-gray-700 mb-1.5"
          htmlFor="product-image"
        >
          Product Image
        </label>

        <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
          {capturedImage ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
              <Input
                disabled
                readOnly
                className="w-full"
                value="📸 Foto tomada con la cámara"
              />

              <Button
                isIconOnly
                aria-label="Take a photo"
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
              id="product-image"
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
              alt="Captured Product"
              className="max-w-full h-auto rounded-md"
              src={capturedImage}
            />
          </div>
        )}
      </div>

      <Button
        className="w-full"
        color="success"
        disabled={loading}
        type="submit"
      >
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </Form>
  );
};

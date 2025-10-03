export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export const getCroppedImg = async (imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }, rotation = 0): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context available');
  }

  const safeArea = Math.max(image.width, image.height) * 2;

  // set canvas size to match the bounding box of the rotated image
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central point on the canvas
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and save context
  ctx.drawImage(image, safeArea / 2 - image.width / 2, safeArea / 2 - image.height / 2);

  // Calculate offsets for the image on the large canvas
  const imageOffsetX = (safeArea - image.width) / 2;
  const imageOffsetY = (safeArea - image.height) / 2;

  // Adjust pixelCrop coordinates relative to the large canvas
  const croppedX = pixelCrop.x + imageOffsetX;
  const croppedY = pixelCrop.y + imageOffsetY;

  const data = ctx.getImageData(croppedX, croppedY, pixelCrop.width, pixelCrop.height);

  // set canvas width to final desired crop size - this will clear the canvas
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated image data into canvas
  ctx.putImageData(data, 0, 0);

  // return as data URL
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file!));
    }, 'image/jpeg');
  });
};

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'; // Default to jpeg if not found
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
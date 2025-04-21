//TODO: Please filter out if it is an image or pdf the return string of base64 conversion has a application/pdf;base64 mime type or image/jpeg;base64 mime type
// TODO: apply on files for camera access on files below
// use-camera-access.ts and  use-image-capture-mutation.ts
// use-pdf-mutation.ts
// use-image-mutation.ts
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("Could not convert file to Base64");
      }
    };

    reader.onerror = (error) => reject(error);
  });
};

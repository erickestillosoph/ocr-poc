// export const base64ToFile = (base64String: string, filename: string): File => {
//   const arr = base64String.split(",");
//   const mimeMatch = arr[0].match(/:(.*?);/);
//   const mime = mimeMatch ? mimeMatch[1] : "";
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], filename, { type: mime });
// };

export const base64ToFile = (
  base64String: string,
  filename: string
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const arr = base64String.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    resolve(new File([u8arr], filename, { type: mime }));
    reject("Could not convert file to Base64");
  });
};

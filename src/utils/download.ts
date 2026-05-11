export const downloadByBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName; //xxx.csv
  a.click();
  URL.revokeObjectURL(url);
};
